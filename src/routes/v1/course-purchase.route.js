import express from 'express'
import isAuthenticated from '~/middlewares/isAuthenticated'
import { coursePurchaseController } from '~/controllers/course-purchase.controller'

const router = express.Router()

router
  .route('/checkout/create-checkout-session')
  .post(isAuthenticated, coursePurchaseController.createCheckoutSession)
router
  .route('/webhook')
  .post(express.raw({ type: 'application/json' }), coursePurchaseController.stripeWebhook)
router
  .route('/course/:courseId/detail-with-status')
  .get(isAuthenticated, coursePurchaseController.getCourseDetailWithPurchaseStatus)

router.route('/').get(isAuthenticated, coursePurchaseController.getAllPurchasedCourse)

export const coursePurchaseRoute = router
