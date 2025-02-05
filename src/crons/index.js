import { cleanUploadsCron } from './clean-uploads.cron'

export const initCrons = () => {
  cleanUploadsCron.start()
}
