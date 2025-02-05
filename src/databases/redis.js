import { Redis as IORedis } from 'ioredis'
import { REDIS_URI } from '~/configs/env'
import { logger } from '~/utils/logger'

export class Redis {
  static instance
  _client

  constructor() {
    this._client = new IORedis(REDIS_URI, {
      retryStrategy: (times) => {
        if (times >= 10) return null
        return 200
      },
      lazyConnect: true
    })

    this._client.on('error', (error) => {
      logger.error(`Failed to connect to Redis server: ${error.message} `)
    })
  }

  static async init() {
    if (!this.instance) {
      this.instance = new Redis()
      await this.instance._connect()
    }
  }

  async _connect() {
    await this._client.connect()
    logger.success('Connected to Redis server')
  }

  async disconnect() {
    if (this._client.status !== 'ready') {
      logger.warning('No connection to Redis server')
      return
    }
    await this._client.quit()
    logger.info('Disconnected Redis server')
  }

  static getInstance = () => {
    if (!this.instance) throw new Error('Redis instance not initialized')
    return this.instance
  }
}
