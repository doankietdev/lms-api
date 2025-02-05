import { config } from 'dotenv'
import { existsSync } from 'fs'
import ms from 'ms'
import { join } from 'path'
import { ENV_NAMES } from '~/utils/constants'
import { logger } from '~/utils/logger'

// Validate the environment name
const isValidEnvName = Object.values(ENV_NAMES).includes(process.env.NODE_ENV)
if (!isValidEnvName) {
  throw Error(`Invalid environment name: ${process.env.NODE_ENV}`)
}

// Load environment variables from .env files
const envFiles = [
  `.env.${process.env.NODE_ENV}.local`,
  `.env.${process.env.NODE_ENV}`,
  '.env.local',
  '.env'
]
for (const file of envFiles) {
  const filePath = join(process.cwd(), file)
  if (existsSync(filePath)) {
    config({ path: filePath })
  }
}

// Validate required environment variables
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_CLOUD_NAME'
]
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    logger.warning(`Missing required environment variable: ${key}`)
  }
})

export const CURRENT_ENV_NAME = process.env.NODE_ENV || ENV_NAMES.PRODUCTION
export const PORT = process.env.PORT || 5600

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
export const DATABASE_NAME = process.env.DATABASE_NAME || 'lms'

export const REDIS_URI = process.env.REDIS_URI || 'redis://default:dev@localhost:6379/0'

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME

export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

export const FILE_UPLOADING_MAX_AGE = ms(process.env.FILE_UPLOADING_MAX_AGE || '5m')
