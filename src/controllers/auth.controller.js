import { authService } from '~/services/auth.service'
import { asyncHandler } from '~/utils/async-handler'
import { generateToken } from '~/utils/generateToken'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body // patel214
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    })
  }
  await authService.register({ name, email, password })
  return res.status(201).json({
    success: true,
    message: 'Account created successfully.'
  })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.'
    })
  }
  const user = await authService.login({ email, password })
  generateToken(res, user, `Welcome back ${user.name}`)
})

export const logout = asyncHandler(async (_, res) => {
  return res.status(200).cookie('token', '', { maxAge: 0 }).json({
    message: 'Logged out successfully.',
    success: true
  })
})

export const authController = {
  register,
  login,
  logout
}
