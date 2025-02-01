import { mediaService } from '~/services/media.service'

const { asyncHandler } = require('~/utils/async-handler')

const uploadVideo = asyncHandler(async (req, res) => {
  const result = await mediaService.uploadVideo(req.file.path)
  res.status(200).json({
    success: true,
    message: 'Video uploaded successfully.',
    data: result
  })
})

export const mediaController = {
  uploadVideo
}
