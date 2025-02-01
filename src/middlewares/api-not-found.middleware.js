import { StatusCodes } from 'http-status-codes'
import { AppError } from '~/errors/app.error'
import { NotFoundError } from '~/errors/common.error'

export const apiNotFoundMiddleware = (req, res, next) => {
  next(AppError.from(NotFoundError, StatusCodes.NOT_FOUND))
}
