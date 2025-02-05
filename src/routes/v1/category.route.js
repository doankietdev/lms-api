import express from 'express'
import { categoryController } from '~/controllers/category.controller'
import { authMiddleware } from '~/middlewares/auth.middleware'
import { permissionMiddleware } from '~/middlewares/permission.middleware'
import { ROLES } from '~/utils/constants'

const router = express.Router()

router.route('/').get(categoryController.getCategories)

router.use(authMiddleware)

router.route('/').post(permissionMiddleware(ROLES.ADMIN), categoryController.createCategory)

export const categoryRoute = router
