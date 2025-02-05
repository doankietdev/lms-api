import express from 'express'
import { mediaController } from '~/controllers/media.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import upload from '~/utils/multer'

const router = express.Router()

router.use(authMiddleware)

router.route('/upload-video').post(upload.single('file'), mediaController.uploadVideo)

export const mediaRoute = router