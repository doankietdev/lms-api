import { auth } from 'express-oauth2-jwt-bearer'
import { AUTH0_URL } from '~/configs/env'
import { User } from '~/models/user.model'
import { asyncHandler } from '~/utils/async-handler'

export const authMiddleware = asyncHandler(async (req, res, next) => {
  auth({
    audience: req.appHost,
    issuerBaseURL: AUTH0_URL,
    tokenSigningAlg: 'RS256'
  })(req, res, async (err) => {
    if (err) next(err)
    const user = await User.findOne({ sub: req.auth?.payload?.sub })
    if (user) {
      req.id = user._id.toString()
      req.role = user.role
    }
    next()
  })
})
