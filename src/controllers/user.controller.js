import { userService } from '~/services/user.service'
import { asyncHandler } from '~/utils/async-handler'

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserProfile(req.id)
  return res.status(200).json({
    success: true,
    user
  })
})

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.id
  const { name } = req.body
  const photoFile = req.file

  const updatedUser = await userService.updateProfile(userId, { name, photoFile })

  return res.status(200).json({
    success: true,
    user: updatedUser,
    message: 'Profile updated successfully.'
  })
})

export const userController = {
  getUserProfile,
  updateProfile
}
