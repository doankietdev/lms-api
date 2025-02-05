import { categoryService } from '~/services/category.service'
import { asyncHandler } from '~/utils/async-handler'

const createCategory = asyncHandler(async (req, res) => {
  const { categoryTitle } = req.body

  const category = await categoryService.createCategory({ categoryTitle })

  res.status(200).json({
    success: true,
    category
  })
})

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories()

  res.status(200).json({
    success: true,
    categories
  })
})

export const categoryController = {
  createCategory,
  getCategories
}
