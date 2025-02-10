import { userService } from '~/services/user.service'
import { asyncHandler } from '~/utils/async-handler'

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.id)
  return res.status(200).json({
    success: true,
    user
  })
})


const changeAvatar = asyncHandler(async (req, res) => {
  const userId = req.id
  const avatarFilePath = req.file.path

  const { avatarUrl } = await userService.changeAvatar(userId, { avatarFilePath })

  return res.status(200).json({
    success: true,
    data: { avatarUrl },
    message: 'Change avatar successfully.'
  })
})

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.id
  const { name } = req.body

  const updatedUser = await userService.updateProfile(userId, { name })

  return res.status(200).json({
    success: true,
    user: updatedUser,
    message: 'Profile updated successfully.'
  })
})

export const userController = {
  getUserProfile,
  changeAvatar,
  updateProfile
}
