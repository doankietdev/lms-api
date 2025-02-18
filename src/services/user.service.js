import { hash } from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import { InternalServerError } from '~/errors/common.error'
import { UserAlreadyExistError, UserNotFoundError } from '~/errors/user.error'
import { User } from '~/models/user.model'
import { cloudinaryProvider } from '~/providers/cloudinary.provider'
import { logger } from '~/utils/logger'

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

const changeAvatar = async (userId, { avatarFilePath }) => {
  const foundUser = await User.findOne({ _id: userId })
  if (!foundUser) throw AppError.from(UserNotFoundError, StatusCodes.NOT_FOUND)

  const { secure_url, public_id } = await cloudinaryProvider.uploadMedia(avatarFilePath)

  const { modifiedCount } = await User.updateOne(
    { _id: userId },
    { photoUrl: secure_url, photoPublicId: public_id }
  )
  if (!modifiedCount) throw AppError.from(InternalServerError, StatusCodes.INTERNAL_SERVER_ERROR)

  if (foundUser.photoPublicId) {
    await cloudinaryProvider.deleteMedia(foundUser.photoPublicId)
  }

  return {
    avatarUrl: secure_url
  }
}

const updateProfile = async (userId, { name }) => {
  const user = await User.findById(userId)
  if (!user) {
    throw AppError.from(UserNotFoundError, StatusCodes.NOT_FOUND)
  }
  return await User.findByIdAndUpdate(userId, { name }, { new: true })
}

export const userService = {
  createUser,
  getUserProfile,
  getUserProfileBySub,
  changeAvatar,
  updateProfile
}
