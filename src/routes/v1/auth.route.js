import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'

const router = express.Router()

router.use(authMiddleware)

router.route('/callback').post(authController.callback)

export const authRoute = router
