import { AppError } from '~/errors/app.error'
import { UserAlreadyExistError } from '~/errors/user.error'
import { userService } from './user.service'

const register = async ({ sub, email, name, photo }) => {
  try {
    const newUser = await userService.createUser({ sub, email, name, photo })
    return await userService.getUserProfile(newUser._id)
  } catch (error) {
    if (error instanceof AppError && error.message === UserAlreadyExistError.message) {
      return await userService.getUserProfileBySub(sub)
    }
    throw error
  }
}

export const authService = {
  register
}
