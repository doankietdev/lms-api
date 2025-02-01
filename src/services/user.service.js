import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import {
  UserNotFoundError
} from '~/errors/user.error'
import { User } from '~/models/user.model'
import { cloudinaryProvider } from '~/providers/cloudinary.provider'

const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').populate('enrolledCourses')
  if (!user) {
    throw AppError.from(UserNotFoundError, StatusCodes.NOT_FOUND)
  }
  return user
}

const updateProfile = async (userId, { name, photoFile }) => {
  const user = await User.findById(userId)
  if (!user) {
    throw AppError.from(UserNotFoundError, StatusCodes.NOT_FOUND)
  }
  if (user.photoUrl) {
    const publicId = user.photoUrl.split('/').pop().split('.')[0] // extract public id
    cloudinaryProvider.deleteMedia(publicId)
  }

  const cloudResponse = await cloudinaryProvider.uploadMedia(photoFile.path)
  const photoUrl = cloudResponse.secure_url

  const updatedData = { name, photoUrl }
  return await User.findByIdAndUpdate(userId, updatedData, { new: true }).select(
    '-password'
  )
}

export const userService = {
  getUserProfile,
  updateProfile
}
