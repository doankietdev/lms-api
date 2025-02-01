import { v2 as cloudinary } from 'cloudinary'
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME
} from '~/configs/env'

cloudinary.config({
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  cloud_name: CLOUDINARY_CLOUD_NAME
})

export const uploadMedia = async (file) => {
  const uploadResponse = await cloudinary.uploader.upload(file, {
    resource_type: 'auto'
  })
  return uploadResponse
}

export const deleteMedia = async (publicId) => {
  await cloudinary.uploader.destroy(publicId)
}

export const deleteVideo = async (publicId) => {
  await cloudinary.uploader.destroy(publicId, { resource_type: 'video' })
}

export const cloudinaryProvider = {
  uploadMedia,
  deleteMedia,
  deleteVideo
}
