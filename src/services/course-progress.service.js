import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import { CourseProgressNotFoundError } from '~/errors/course-progress.error'
import { CourseNotFoundError } from '~/errors/course.error'
import { Course } from '~/models/course.model'
import { CourseProgress } from '~/models/course-progress.model'

const getCourseProgress = async (courseId, userId) => {
  const courseDetails = await Course.findById(courseId).populate('lectures')
  let courseProgress = await CourseProgress.findOne({
    courseId,
    userId
  }).populate('courseId')

  if (!courseDetails) {
    throw AppError.from(CourseNotFoundError, StatusCodes.NOT_FOUND)
  }

  if (!courseProgress) {
    return {
      courseDetails,
      progress: [],
      completed: false
    }
  }

  return {
    courseDetails,
    progress: courseProgress.lectureProgress,
    completed: courseProgress.completed
  }
}

const updateLectureProgress = async ({ userId, courseId, lectureId }) => {
  // fetch or create course progress
  let courseProgress = await CourseProgress.findOne({ courseId, userId })

  if (!courseProgress) {
    // If no progress exist, create a new record
    courseProgress = new CourseProgress({
      userId,
      courseId,
      completed: false,
      lectureProgress: []
    })
  }

  // find the lecture progress in the course progress
  const lectureIndex = courseProgress.lectureProgress.findIndex(
    (lecture) => lecture.lectureId === lectureId
  )

  if (lectureIndex !== -1) {
    // if lecture already exist, update its status
    courseProgress.lectureProgress[lectureIndex].viewed = true
  } else {
    // Add new lecture progress
    courseProgress.lectureProgress.push({
      lectureId,
      viewed: true
    })
  }

  // if all lecture is complete
  const lectureProgressLength = courseProgress.lectureProgress.filter(
    (lectureProg) => lectureProg.viewed
  ).length

  const course = await Course.findById(courseId)

  let isCourseCompleted = false
  if (course.lectures.length === lectureProgressLength) {
    courseProgress.completed = true
    isCourseCompleted = true
  }

  await courseProgress.save()

  return {
    isCourseCompleted
  }
}

const markAsCompleted = async ({ userId, courseId }) => {
  const courseProgress = await CourseProgress.findOne({ courseId, userId })
  if (!courseProgress) {
    throw AppError.from(CourseProgressNotFoundError, StatusCodes.NOT_FOUND)
  }

  courseProgress.lectureProgress.map((lectureProgress) => (lectureProgress.viewed = true))
  courseProgress.completed = true
  await courseProgress.save()
}

const markAsInCompleted = async ({ userId, courseId }) => {
  const courseProgress = await CourseProgress.findOne({ courseId, userId })
  if (!courseProgress) {
    throw AppError.from(CourseProgressNotFoundError, StatusCodes.NOT_FOUND)
  }

  courseProgress.lectureProgress.map((lectureProgress) => (lectureProgress.viewed = false))
  courseProgress.completed = false
  await courseProgress.save()
}

export const courseProgressService = {
  getCourseProgress,
  updateLectureProgress,
  markAsCompleted,
  markAsInCompleted
}
