import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import pkg from 'multer-storage-cloudinary';
const { CloudinaryStorage } = pkg;  // ✅ fix for CommonJS module

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class FileUploadMiddleware {
  constructor() {
    this.storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder:          'food-delivery',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation:  [{ width: 500, height: 500, crop: 'limit' }],
      },
    });
  }

  upload(fieldName = 'image') {
    return multer({
      storage: this.storage,
      limits: { fileSize: 5 * 1024 * 1024 },
    }).single(fieldName);
  }
}

export default new FileUploadMiddleware();