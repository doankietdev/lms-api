import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from '~/configs/env'

cloudinary.config({
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  cloud_name: CLOUDINARY_CLOUD_NAME
})

/**
 *
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadMedia = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('filePath is missing')
    }

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        filePath,
        { resource_type: 'auto', folder: 'lms' },
        function (error, result) {
          if (error) return reject(error)
          resolve(result)
        }
      )
    })

    // Unlink the local file after successful upload
    fs.unlinkSync(filePath)
    return response
  } catch (error) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (unlinkError) {
      /* empty */
    }

    throw error
  }
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
