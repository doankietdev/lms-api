import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import {
  UserAlreadyExistError,
  UserNotFoundError
} from '~/errors/user.error'
import { User } from '~/models/user.model'
import { cloudinaryProvider } from '~/providers/cloudinary.provider'

const createUser = async ({ sub, email, name, photo }) => {
  const user = await User.findOne({ sub })
  if (user) {
    throw AppError.from(UserAlreadyExistError, StatusCodes.BAD_REQUEST)
  }
  return await User.create({
    sub,
    name,
    email,
    photoUrl: photo
  })
}

const getUserProfile = async (userId) => {
  const user = await User.findOne({ _id: userId }).populate('enrolledCourses')
  if (!user) {
    throw AppError.from(UserNotFoundError, StatusCodes.NOT_FOUND)
  }
  return user
}

const getUserProfileBySub = async (sub) => {
  const user = await User.findOne({ sub }).populate('enrolledCourses')
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
  return await User.findByIdAndUpdate(userId, updatedData, { new: true })
}

export const userService = {
  createUser,
  getUserProfile,
  getUserProfileBySub,
  updateProfile
}
