import multer from 'multer'
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'src/private/images')
  },
  filename(req, file, callback) {
    callback(null, `${file.originalname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

export const upload = multer({storage: storage})