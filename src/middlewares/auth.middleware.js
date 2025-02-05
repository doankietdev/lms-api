import { auth } from 'express-oauth2-jwt-bearer'
import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import { UserNotFoundError } from '~/errors/user.error'
import { User } from '~/models/user.model'
import { asyncHandler } from '~/utils/async-handler'

export const authMiddleware = asyncHandler(async (req, res, next) => {
  auth({
    audience: 'http://localhost:5600',
    issuerBaseURL: 'https://dev-q1zz5bk8qg766s2e.us.auth0.com/',
    tokenSigningAlg: 'RS256'
  })(req, res, async (err) => {
    if (err) throw err
    const user = await User.findOne({ sub: req.auth?.payload?.sub })
    if (!user) throw AppError.from(UserNotFoundError, StatusCodes.NOT_FOUND)
    req.id = user._id.toString()
    req.role = user.role
    next()
  })
})
