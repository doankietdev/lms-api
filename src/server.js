import exitHook from 'async-exit-hook'
import { app } from './app'
import { CURRENT_ENV_NAME, PORT } from './configs/env'
import { logger } from './utils/logger'
import { MongoDB } from './databases/mongodb'
import { Redis } from './databases/redis'

const startServer = async () => {
  try {
    logger.info(`Starting server in ${CURRENT_ENV_NAME} mode...`)

    await Promise.all([
      MongoDB.init(),
      Redis.init()
    ])

    const server = app.listen(PORT, () => {
      logger.success(`Server is running on port ${PORT}`)
    })

    exitHook(async () => {
      await Promise.all([
        MongoDB.getInstance().disconnect(),
        Redis.getInstance().disconnect()
      ])
      server.close(() => {
        logger.info('Server is closed')
      })
    })
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()