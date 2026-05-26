import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

// =========================================
// CLOUDINARY CONFIGURATION
// =========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =========================================
// STORAGE ENGINES
// =========================================
const storageProducts = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "foodiehub/products", // Cloudinary will automatically create this folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const storageUsers = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "foodiehub/users", // Cloudinary will automatically create this folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// =========================================
// EXPORTS
// =========================================

// Default export for products (matches your existing setup)
const upload = multer({
  storage: storageProducts,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
export default upload;

// Named export for users (matches your existing setup)
export const uploadUser = multer({
  storage: storageUsers,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});