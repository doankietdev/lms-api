
export const convertFileAppUrlToLocalPath = (fileAppUrl = '') => {
  return fileAppUrl.split('/uploads/')[1]
}
