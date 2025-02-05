import { authService } from '~/services/auth.service'
import { asyncHandler } from '~/utils/async-handler'

export const callback = asyncHandler(async (req, res) => {
  const sub = req.auth?.payload?.sub

  const { name, email, picture } = req.body
  if (!name || !email || !picture) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    })
  }

  const user = await authService.register({ sub, name, email, photo: picture })

  res.status(200).json({
    success: true,
    user
  })
})

export const authController = {
  callback
}
