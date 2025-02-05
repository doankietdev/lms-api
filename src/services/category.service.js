import { Category } from '~/models/category.model'

const createCategory = async ({ categoryTitle }) => {
  return await Category.create({ categoryTitle })
}

const getCategories = async () => {
  return await Category.find()
}

export const categoryService = {
  createCategory,
  getCategories
}
