import { auth, InvalidTokenError, UnauthorizedError } from 'express-oauth2-jwt-bearer'
import { StatusCodes } from 'http-status-codes'
import { AUTH0_URL } from '~/configs/env'
import { AppError } from '~/errors/app.error'
import { AuthFailureError } from '~/errors/auth.error'
import { User } from '~/models/user.model'
import { asyncHandler } from '~/utils/async-handler'

export const authMiddleware = asyncHandler(async (req, res, next) => {
  auth({
    audience: req.appHost,
    issuerBaseURL: AUTH0_URL,
    tokenSigningAlg: 'RS256'
  })(req, res, async (err) => {
    try {
      if (err) {
        if (err instanceof InvalidTokenError || err instanceof UnauthorizedError) {
          next(AppError.from(AuthFailureError, StatusCodes.UNAUTHORIZED).withLog(err.message))
        } else {
          next(err)
        }
        return
      }

      const user = await User.findOne({ sub: req.auth?.payload?.sub })
      if (user) {
        req.id = user._id.toString()
        req.role = user.role
      }
      next()
    } catch (error) {
      next(error)
    }
  })
})
