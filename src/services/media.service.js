import { cloudinaryProvider } from '~/providers/cloudinary.provider'

const uploadVideo = async (filePath) => {
  return await cloudinaryProvider.uploadMedia(filePath)
}

export const mediaService = {
  uploadVideo
}
