import mongoose from 'mongoose'
import { DATABASE_NAME, MONGODB_URI } from '~/configs/env'
import { logger } from '~/utils/logger'

export class MongoDB {
  async _connect() {
    try {
      await mongoose.connect(MONGODB_URI, {
        dbName: DATABASE_NAME
      })
      logger.success('Connected to MongoDB server')
    } catch (error) {
      logger.error(`Failed to connect to database server: ${error.message}`)
      throw error
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      logger.info('Disconnected MongoDB server')
    } catch (error) {
      logger.error(`Failed to disconnect from MongoDB server: ${error.message}`)
      throw error
    }
  }

  static async init() {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB()
      await MongoDB.instance._connect()
    }
  }

  static getInstance() {
    if (!MongoDB.instance) {
      throw new Error('MongoDB instance has not been initialized')
    }
    return MongoDB.instance
  }
}
