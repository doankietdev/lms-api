
export const hostMiddleware = (req, res, next) => {
  if (req.app.get('trust proxy')) {
    const protocol = req.get('X-Forwarded-Proto') || req.protocol
    const host = req.get('X-Forwarded-Host') || req.get('host')
    req.appHost = `${protocol}://${host}`
  } else {
    const protocol = req.protocol
    const host = req.get('host')
    req.appHost = `${protocol}://${host}`
  }

  next()
}
