import mongoose from 'mongoose'

const categoryModel = new mongoose.Schema({
  categoryTitle: { type: String, required: true }
}, { timestamps: true })

export const Category = mongoose.model('Category', categoryModel)