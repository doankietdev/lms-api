import { courseProgressService } from '~/services/course-progress.service'
import { asyncHandler } from '~/utils/async-handler'

const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params
  const userId = req.id

  const data = await courseProgressService.getCourseProgress(courseId, userId)

  return res.status(200).json({
    data
  })
})

const updateLectureProgress = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params
  const userId = req.id

  const { isCourseCompleted } = await courseProgressService.updateLectureProgress({
    userId,
    courseId,
    lectureId
  })

  return res.status(200).json({
    message: 'Lecture progress updated successfully.',
    data: {
      isCourseCompleted
    }
  })
})

const markAsCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params
  const userId = req.id

  await courseProgressService.markAsCompleted({ userId, courseId })

  return res.status(200).json({ message: 'Course marked as completed.' })
})

const markAsInCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params
  const userId = req.id

  await courseProgressService.markAsInCompleted({ userId, courseId })

  return res.status(200).json({ message: 'Course marked as incompleted.' })
})

export const courseProgressController = {
  getCourseProgress,
  updateLectureProgress,
  markAsCompleted,
  markAsInCompleted
}
