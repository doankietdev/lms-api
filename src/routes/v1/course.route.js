import express from 'express'
import isAuthenticated from '~/middlewares/isAuthenticated'
import { courseController } from '~/controllers/course.controller'
import upload from '~/utils/multer'

const router = express.Router()

router.route('/').post(isAuthenticated, courseController.createCourse)
router.route('/search').get(isAuthenticated, courseController.searchCourse)
router.route('/published-courses').get(courseController.getPublishedCourse)
router.route('/').get(isAuthenticated, courseController.getCreatorCourses)
router
  .route('/:courseId')
  .put(isAuthenticated, upload.single('courseThumbnail'), courseController.editCourse)
router.route('/:courseId').get(isAuthenticated, courseController.getCourseById)
router.route('/:courseId/lecture').post(isAuthenticated, courseController.createLecture)
router.route('/:courseId/lecture').get(isAuthenticated, courseController.getCourseLecture)
router.route('/:courseId/lecture/:lectureId').post(isAuthenticated, courseController.editLecture)
router.route('/lecture/:lectureId').delete(isAuthenticated, courseController.removeLecture)
router.route('/lecture/:lectureId').get(isAuthenticated, courseController.getLectureById)
router.route('/:courseId').patch(isAuthenticated, courseController.togglePublishCourse)

export const courseRoute = router
