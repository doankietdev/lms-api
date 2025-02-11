import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'
import { CURRENT_ENV_NAME } from '~/configs/env'
import { AppError } from '~/errors/app.error'
import { ENV_NAMES } from '~/utils/constants'
import { InternalServerError, InvalidInputError } from '~/errors/common.error'

export const errorMiddleware = (error, req, res, next) => {
  const isProduction = CURRENT_ENV_NAME === ENV_NAMES.PRODUCTION
  // eslint-disable-next-line no-console
  !isProduction && console.error(error.stack)

  if (error instanceof AppError) {
    res.status(error.getStatus()).json(error.toJSON(isProduction))
  } else if (error instanceof ZodError) {
    const appError = AppError.from(InvalidInputError, StatusCodes.BAD_REQUEST).wrap(error)

    error.issues.forEach((issue) => {
      appError.withDetail(issue.path.join('.'), issue.message)
    })

    res.status(appError.getStatus()).json(appError.toJSON(isProduction))
  } else {
    const appError = AppError.from(InternalServerError, StatusCodes.INTERNAL_SERVER_ERROR).wrap(
      error
    )
    res.status(appError.getStatus()).json(appError.toJSON(isProduction))
  }

  return next()
}
