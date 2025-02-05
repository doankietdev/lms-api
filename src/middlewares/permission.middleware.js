import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import { AccessDeniedError } from '~/errors/auth.error'

export const permissionMiddleware = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.role)) return next()
    next(AppError.from(AccessDeniedError, StatusCodes.FORBIDDEN))
  }
}
