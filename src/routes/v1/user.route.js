import express from 'express'
import { userController } from '~/controllers/user.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import upload from '~/utils/multer'

const router = express.Router()

router.use(authMiddleware)

router.route('/profile').get(userController.getUserProfile)
router
  .route('/profile/update')
  .put(upload.single('profilePhoto'), userController.updateProfile)

export const userRoute = router
