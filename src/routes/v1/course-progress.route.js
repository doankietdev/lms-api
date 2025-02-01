import express from 'express'
import { courseProgressController } from '~/controllers/course-progress.controller'
import isAuthenticated from '~/middlewares/isAuthenticated'

const router = express.Router()

router.route('/:courseId').get(isAuthenticated, courseProgressController.getCourseProgress)
router
  .route('/:courseId/lecture/:lectureId/view')
  .post(isAuthenticated, courseProgressController.updateLectureProgress)
router.route('/:courseId/complete').post(isAuthenticated, courseProgressController.markAsCompleted)
router
  .route('/:courseId/incomplete')
  .post(isAuthenticated, courseProgressController.markAsInCompleted)

export const courseProgressRoute = router
