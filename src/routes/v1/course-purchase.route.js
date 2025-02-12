import express from 'express'
import { coursePurchaseController } from '~/controllers/course-purchase.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { permissionMiddleware } from '~/middlewares/permission.middleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router
  .route('/webhook')
  .post(express.raw({ type: 'application/json' }), coursePurchaseController.stripeWebhook)

router.use(authMiddleware)

router
  .route('/checkout/create-checkout-session')
  .post(coursePurchaseController.createCheckoutSession)
router
  .route('/course/:courseId/detail-with-status')
  .get(coursePurchaseController.getCourseDetailWithPurchaseStatus)

router
  .route('/')
  .get(
    permissionMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR),
    coursePurchaseController.getAllPurchasedCourse
  )

export const coursePurchaseRoute = router
