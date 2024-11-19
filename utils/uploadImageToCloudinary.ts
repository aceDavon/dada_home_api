import { Readable } from "stream"
import {
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary"
import cloudinary from "../app/config/cloudinary.config"

const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve(result)
        }
      }
    )

    Readable.from(fileBuffer).pipe(uploadStream)
  })
}

export { uploadImageToCloudinary }
