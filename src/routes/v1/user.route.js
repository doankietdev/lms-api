import express from 'express'
import { userController } from '~/controllers/user.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import upload from '~/utils/multer'

const router = express.Router()

router.use(authMiddleware)

router.route('/change-avatar').patch(upload.single('avatar'), userController.changeAvatar)
router.route('/profile').get(userController.getUserProfile)
router
  .route('/profile/update')
  .put(userController.updateProfile)

export const userRoute = router
