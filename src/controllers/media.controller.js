import { mediaService } from '~/services/media.service'

const { asyncHandler } = require('~/utils/async-handler')

const uploadVideo = asyncHandler(async (req, res) => {
  const { url } = mediaService.uploadVideo(req.appHost, req.file.path)

  res.status(200).json({
    success: true,
    message: 'Video uploaded successfully.',
    data: {
      url
    }
  })
})

export const mediaController = {
  uploadVideo
}
