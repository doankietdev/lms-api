import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { AppError } from '~/errors/app.error'
import {
  CannotRegisterNoFreeCourseError,
  CourseNotFoundError,
  CreatorCannotRegisterError
} from '~/errors/course.error'
import { LectureNotFoundError } from '~/errors/lecture.error'
import { Course } from '~/models/course.model'
import { Lecture } from '~/models/lecture.model'
import { User } from '~/models/user.model'
import { cloudinaryProvider } from '~/providers/cloudinary.provider'
import { convertFileAppUrlToLocalPath } from '~/utils/formatter'
import { logger } from '~/utils/logger'

const createCourse = async ({ courseTitle, category, creator }) => {
  return await Course.create({
    courseTitle,
    category,
    creator
  })
}

const searchCourse = async ({ query = '', categories = '', sortByPrice = '' }) => {
  const searchCriteria = {
    isPublished: true,
    $or: [
      { courseTitle: { $regex: query, $options: 'i' } },
      { subTitle: { $regex: query, $options: 'i' } }
    ]
  }

  // if categories selected
  const arrayCategories = categories?.split(',')
  if (arrayCategories.length > 0 && arrayCategories[0] !== '') {
    searchCriteria.category = { $in: arrayCategories }
  }

  // define sorting order
  const sortOptions = {}
  if (sortByPrice === 'low') {
    sortOptions.coursePrice = 1 //sort by price in ascending
  } else if (sortByPrice === 'high') {
    sortOptions.coursePrice = -1 // descending
  }

  return await Course.find(searchCriteria)
    .populate({ path: 'creator', select: 'name photoUrl' })
    .sort(sortOptions)
}

const registerFree = async ({ courseId, userId }) => {
  const foundCourse = await Course.findOne({ _id: courseId })
  if (!foundCourse) throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)

  if (foundCourse.creator.equals(userId))
    throw AppError.from(CreatorCannotRegisterError, StatusCodes.BAD_REQUEST)

  if (foundCourse.coursePrice > 0)
    AppError.from(CannotRegisterNoFreeCourseError, StatusCodes.BAD_REQUEST)

  const [updatedUser, updatedCourse] = await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: foundCourse._id } },
      { new: true }
    ),
    Course.findByIdAndUpdate(
      foundCourse._id,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    )
  ])
  if (!updatedUser || !updatedCourse)
    throw AppError.from(
      new Error('Failed to  register for study'),
      StatusCodes.INTERNAL_SERVER_ERROR
    ).withLog('User not found order Course not found')
}

const getPublishedCourse = async () => {
  return await Course.find({ isPublished: true }).populate({
    path: 'creator',
    select: 'name photoUrl'
  })
}

const getCreatorCourses = async (userId) => {
  return await Course.find({ creator: userId })
}

const editCourse = async (
  courseId,
  thumbnailFile,
  { courseTitle, subTitle, description, category, courseLevel, coursePrice }
) => {
  let course = await Course.findById(courseId)
  if (!course) throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)

  let courseThumbnail
  if (thumbnailFile) {
    if (course.courseThumbnail) {
      const publicId = course.courseThumbnail.split('/').pop().split('.')[0]
      await cloudinaryProvider.deleteMedia(publicId) // delete old image
    }
    // upload a thumbnail on clourdinary
    courseThumbnail = await cloudinaryProvider.uploadMedia(thumbnailFile.path)
  }

  const updateData = {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice,
    courseThumbnail: courseThumbnail?.secure_url
  }

  course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
}

const getCourseById = async (courseId) => {
  const course = await Course.findById(courseId).populate('category')
  if (!course) throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)
  return course
}

const createLecture = async (courseId, { lectureTitle }) => {
  const course = await Course.findById(courseId)
  if (!course) {
    throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)
  }
  const lecture = await Lecture.create({ lectureTitle })
  course.lectures.push(lecture._id)
  await course.save()
  return lecture
}

const getCourseLecture = async (courseId) => {
  const course = await Course.findById(courseId).populate('lectures')
  if (!course) {
    throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)
  }
  return course
}

const uploadLectureVideoToCloudinary = async (videoUrl, lectureId) => {
  try {
    const { secure_url, public_id } = await cloudinaryProvider.uploadMedia(
      path.join(process.cwd(), 'uploads', convertFileAppUrlToLocalPath(videoUrl))
    )
    await Lecture.updateOne({ _id: lectureId }, { videoUrl: secure_url, publicId: public_id })
  } catch (error) {
    logger.error(`Upload lecture video to cloudinary failed:: ${error.message}`)
  }
}

const editLecture = async (
  { courseId, lectureId },
  { lectureTitle, description, videoUrl, isPreviewFree }
) => {
  const lecture = await Lecture.findById(lectureId)
  if (!lecture) throw AppError.from(LectureNotFoundError, StatusCodes.NOT_FOUND)

  // update lecture
  if (lectureTitle) lecture.lectureTitle = lectureTitle
  if (videoUrl && lecture.videoUrl !== videoUrl) {
    lecture.videoUrl = videoUrl
    uploadLectureVideoToCloudinary(videoUrl, lecture._id)
  }
  if (description) lecture.description = description
  if (isPreviewFree) lecture.isPreviewFree = isPreviewFree

  await lecture.save()

  // Ensure the course still has the lecture id if it was not already added;
  const course = await Course.findById(courseId)
  if (course && !course.lectures.includes(lecture._id)) {
    course.lectures.push(lecture._id)
    await course.save()
  }

  return lecture
}

const removeLecture = async (lectureId) => {
  const lecture = await Lecture.findByIdAndDelete(lectureId)
  if (!lecture) {
    throw AppError.from(LectureNotFoundError, StatusCodes.NOT_FOUND)
  }
  // delete the lecture from couldinary as well
  if (lecture.publicId) {
    await cloudinaryProvider.deleteVideo(lecture.publicId)
  }

  // Remove the lecture reference from the associated course
  await Course.updateOne(
    { lectures: lectureId }, // find the course that contains the lecture
    { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
  )
}

const getLectureById = async (lectureId) => {
  const lecture = await Lecture.findById(lectureId)
  if (!lecture) {
    throw AppError.from(LectureNotFoundError, StatusCodes.NOT_FOUND)
  }
  return lecture
}

const togglePublishCourse = async (courseId, publish) => {
  const course = await Course.findById(courseId)
  if (!course) {
    throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)
  }
  // publish status based on the query paramter
  course.isPublished = publish === 'true'
  await course.save()

  return course.isPublished ? 'Published' : 'Unpublished'
}

export const courseService = {
  createCourse,
  searchCourse,
  registerFree,
  getPublishedCourse,
  getCreatorCourses,
  editCourse,
  getCourseById,
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  getLectureById,
  togglePublishCourse,
  uploadLectureVideoToCloudinary
}
