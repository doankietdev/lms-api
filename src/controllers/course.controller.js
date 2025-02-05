import { courseService } from '~/services/course.service'
import { asyncHandler } from '~/utils/async-handler'

const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body
  if (!courseTitle || !category) {
    return res.status(400).json({
      message: 'Course title and category is required.'
    })
  }

  const course = courseService.createCourse({
    courseTitle,
    category,
    creator: req.id
  })

  return res.status(201).json({
    course,
    message: 'Course created.'
  })
})

const searchCourse = asyncHandler(async (req, res) => {
  const { query = '', categories = [], sortByPrice = '' } = req.query

  const courses = await courseService.searchCourse({ query, categories, sortByPrice })

  return res.status(200).json({
    success: true,
    courses: courses || []
  })
})

const getPublishedCourse = asyncHandler(async (req, res) => {
  const courses = await courseService.getPublishedCourse()
  if (!courses) {
    return res.status(404).json({
      message: 'Course not found'
    })
  }
  return res.status(200).json({
    courses
  })
})

const getCreatorCourses = asyncHandler(async (req, res) => {
  const userId = req.id
  const courses = await courseService.getCreatorCourses(userId)
  if (!courses) {
    return res.status(404).json({
      courses: [],
      message: 'Course not found'
    })
  }
  return res.status(200).json({
    courses
  })
})

const editCourse = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId
  const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body
  const thumbnailFile = req.file

  const course = await courseService.editCourse(courseId, thumbnailFile, {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice
  })

  return res.status(200).json({
    course,
    message: 'Course updated successfully.'
  })
})

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params

  const course = await courseService.getCourseById(courseId)

  return res.status(200).json({
    course
  })
})

const createLecture = asyncHandler(async (req, res) => {
  const { lectureTitle } = req.body
  const { courseId } = req.params

  if (!lectureTitle || !courseId) {
    return res.status(400).json({
      message: 'Lecture title is required'
    })
  }

  const lecture = await courseService.createLecture(courseId, { lectureTitle })

  return res.status(201).json({
    lecture,
    message: 'Lecture created successfully.'
  })
})

const getCourseLecture = asyncHandler(async (req, res) => {
  const { courseId } = req.params
  const course = await courseService.getCourseLecture(courseId)
  return res.status(200).json({
    lectures: course.lectures
  })
})

const editLecture = asyncHandler(async (req, res) => {
  const { lectureTitle, description, videoUrl, isPreviewFree } = req.body

  const { courseId, lectureId } = req.params

  const lecture = await courseService.editLecture(
    { courseId, lectureId },
    { lectureTitle, description, videoUrl, isPreviewFree }
  )

  return res.status(200).json({
    lecture,
    message: 'Lecture updated successfully.'
  })
})

const removeLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params

  await courseService.removeLecture(lectureId)

  return res.status(200).json({
    message: 'Lecture removed successfully.'
  })
})

const getLectureById = asyncHandler(async (req, res) => {
  const { lectureId } = req.params
  const lecture = await courseService.getLectureById(lectureId)
  return res.status(200).json({
    lecture
  })
})

const togglePublishCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params
  const { publish } = req.query // true, false

  const statusMessage = await courseService.togglePublishCourse(courseId, publish)

  return res.status(200).json({
    message: `Course is ${statusMessage}`
  })
})

export const courseController = {
  createCourse,
  searchCourse,
  getPublishedCourse,
  getCreatorCourses,
  editCourse,
  getCourseById,
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  getLectureById,
  togglePublishCourse
}