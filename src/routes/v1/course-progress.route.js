import express from 'express'
import { courseProgressController } from '~/controllers/course-progress.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = express.Router()

router.use(authMiddleware)

router.route('/:courseId').get(courseProgressController.getCourseProgress)
router
  .route('/:courseId/lecture/:lectureId/view')
  .post(courseProgressController.updateLectureProgress)
router.route('/:courseId/complete').post(courseProgressController.markAsCompleted)
router
  .route('/:courseId/incomplete')
  .post(courseProgressController.markAsInCompleted)

export const courseProgressRoute = router
