
const uploadVideo = (appHost, filePath) => {
  const url = `${appHost}/uploads/${
    filePath.split('uploads/')[1]
  }`
  return { url }
}

export const mediaService = {
  uploadVideo
}