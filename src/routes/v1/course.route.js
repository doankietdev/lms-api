import express from 'express'
import { courseController } from '~/controllers/course.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { permissionMiddleware } from '~/middlewares/permission.middleware'
import { ROLES } from '~/utils/constants'
import upload from '~/utils/multer'

const router = express.Router()

router.route('/published-courses').get(courseController.getPublishedCourse)

router.route('/search').get(courseController.searchCourse)

router.use(authMiddleware)

router.route('/register-free').post(courseController.registerFree)

router
  .route('/')
  .post(permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR), courseController.createCourse)

router.route('/').get(courseController.getCreatorCourses)
router
  .route('/:courseId')
  .put(
    permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR),
    upload.single('courseThumbnail'),
    courseController.editCourse
  )
router
  .route('/:courseId')
  .get(permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR), courseController.getCourseById)
router
  .route('/:courseId/lecture')
  .post(permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR), courseController.createLecture)
router.route('/:courseId/lecture').get(courseController.getCourseLecture)
router
  .route('/:courseId/lecture/:lectureId')
  .post(permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR), courseController.editLecture)
router
  .route('/lecture/:lectureId')
  .delete(permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR), courseController.removeLecture)
router
  .route('/lecture/:lectureId')
  .get(permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR), courseController.getLectureById)
router
  .route('/:courseId')
  .patch(permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR), courseController.togglePublishCourse)

export const courseRoute = router
