import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import { CLIENT_URL } from './configs/env.js'
import { apiNotFoundMiddleware } from './middlewares/api-not-found.middleware.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { hostMiddleware } from './middlewares/host.middleware.js'
import { route } from './routes/index.js'
import { initCrons } from './crons'

const app = express()

app.use(hpp())
app.use(helmet())
app.use(compression())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
  origin: CLIENT_URL,
  credentials:true
}))
app.set('trust proxy', 1)
app.use(hostMiddleware)

initCrons()

route(app)

app.all('*', apiNotFoundMiddleware)
app.use(errorMiddleware)

export {
  app
}
