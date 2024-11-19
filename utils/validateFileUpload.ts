import multer, { StorageEngine, FileFilterCallback } from "multer"
import path from "path"
import { Request } from "express"

type FileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void

const storage: StorageEngine = multer.memoryStorage()

const fileFilter: FileFilter = (_, file, cb) => {
  const fileTypes = /jpeg|jpg|png|heif/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error("Only JPEG, JPG, HEIF, or PNG images are allowed!"))
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
})

export { upload }
