import fs from 'fs'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'others'

    if (file.mimetype.startsWith('image/')) {
      folder = 'images'
    } else if (file.mimetype.startsWith('video/')) {
      folder = 'videos'
    } else if (file.mimetype.startsWith('application/pdf') || file.mimetype.includes('document')) {
      folder = 'documents'
    }

    const uploadFolder = path.join(process.cwd(), 'uploads', folder)
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true })
    }
    cb(null, uploadFolder)
  },
  filename: function (req, file, cb) {
    const userId = req?.id || 'guest'
    const fileExtension = path.extname(file.originalname)
    const timestamp = Date.now()

    cb(null, `${userId}-${timestamp}${fileExtension}`)
  }
})

const fileUploadMiddleware = {
  single(fieldName = '') {
    return (req, res, next) => {
      multer({ storage: storage }).single(fieldName)(req, res, (err) => {
        if (err) next(err)

        if (req.file) {
          req.fileUrl = `${req.appHost}/uploads/${req.file.path.split('uploads/')[1]}`
        }

        next()
      })
    }
  },
  fields(fieldNames = []) {
    return (req, res, next) => {
      multer({ storage: storage }).fields(fieldNames)(req, res, (err) => {
        if (err) next(err)

        if (req.files) {
          req.fileUrls = req.files.map(
            (file) => (req.fileUrl = `${req.appHost}/uploads/${file.path.split('uploads/')[1]}`)
          )
        }

        next()
      })
    }
  }
}

export default fileUploadMiddleware
