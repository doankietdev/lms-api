import express from 'express'
import { userController } from '~/controllers/user.controller'
import isAuthenticated from '~/middlewares/isAuthenticated'
import upload from '~/utils/multer'

const router = express.Router()

router.route('/profile').get(isAuthenticated, userController.getUserProfile)
router
  .route('/profile/update')
  .put(isAuthenticated, upload.single('profilePhoto'), userController.updateProfile)

export const userRoute = router
