import multer from 'multer'
import path from 'path'
import fs from 'fs'

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

export default multer({ storage: storage })
