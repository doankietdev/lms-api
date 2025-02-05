import cron from 'node-cron'
import fs from 'fs-extra'
import path from 'path'
import { glob } from 'glob'
import { logger } from '~/utils/logger'
import { FILE_UPLOADING_MAX_AGE } from '~/configs/env'

const start = () => {
  cron.schedule('0 3 * * *', async () => {
    try {
      logger.info('Cleaning uploads folder...')

      const uploadDir = path.join(process.cwd(), 'uploads')
      const now = Date.now()

      const files = await glob(`${uploadDir}/**/*-*.*`)

      files.forEach((file) => {
        const filename = path.basename(file)
        try {
          const regex = /^([a-zA-Z0-9]+)-(\d+)\.(\w+)$/ // {userId}-{timestamp}.{ext}
          const match = filename.match(regex)
          if (match) {
            const timestamp = parseInt(match[2], 10)
            if (!isNaN(timestamp) && now - timestamp > FILE_UPLOADING_MAX_AGE) {
              fs.removeSync(file)
              logger.info(`${filename} file deleted`)
            }
          }
        } catch (error) {
          logger.error(`Failed to delete ${filename} file: ${error.message}`)
        }
      })

      logger.success('Clean uploads folder is completed')
    } catch (error) {
      logger.error(`Failed to scan folder: ${error.message}`)
    }
  })
}

export const cleanUploadsCron = {
  start
}
