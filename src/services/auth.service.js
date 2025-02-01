import bcrypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import { EmailAlreadyInUseError, IncorrectEmailOrPasswordError } from '~/errors/user.error'
import { User } from '~/models/user.model'

const register = async ({ name, email, password }) => {
  const user = await User.findOne({ email })
  if (user) {
    throw AppError.from(EmailAlreadyInUseError, StatusCodes.BAD_REQUEST)
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  await User.create({
    name,
    email,
    password: hashedPassword
  })
}

const login = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw AppError.from(IncorrectEmailOrPasswordError, StatusCodes.BAD_REQUEST)
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password)
  if (!isPasswordMatch) {
    throw AppError.from(IncorrectEmailOrPasswordError, StatusCodes.BAD_REQUEST)
  }
  return user
}

export const authService = {
  register,
  login
}
