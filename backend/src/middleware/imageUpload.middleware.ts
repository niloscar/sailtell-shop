
import multer from 'multer'

const ALLOWED_TYPES = ['image/jpeg', 'image/png']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      callback(new Error('Endast JPEG och PNG är tillåtna.'))
      return
    }

    callback(null, true)
  }
})

export const uploadProductImageFile = upload.single('image')
