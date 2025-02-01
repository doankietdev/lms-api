import express from 'express'
import { authRoute } from './auth.route'
import { courseProgressRoute } from './course-progress.route'
import { courseRoute } from './course.route'
import { mediaRoute } from './media.route'
import { coursePurchaseRoute } from './course-purchase.route'
import { userRoute } from './user.route'

const router = express.Router()

router.use('/auth', authRoute)
router.use('/media', mediaRoute)
router.use('/user', userRoute)
router.use('/course', courseRoute)
router.use('/purchase', coursePurchaseRoute)
router.use('/progress', courseProgressRoute)

export const v1Route = router
