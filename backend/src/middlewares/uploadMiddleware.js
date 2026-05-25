import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// =========================================
// ES MODULE SETUP
// =========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================================
// DIRECTORIES
// =========================================
// __dirname is src/middlewares. Go up to src (..), up to backend (..), into uploads!
const productsDir = path.join(__dirname, "..", "..", "uploads", "products");
const usersDir = path.join(__dirname, "..", "..", "uploads", "users");

// =========================================
// CREATE DIRECTORIES IF THEY DON'T EXIST
// =========================================
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

// =========================================
// FILE FILTER
// =========================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP images are allowed"));
  }
};

// =========================================
// STORAGE ENGINES
// =========================================
const storageProducts = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const storageUsers = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, usersDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// =========================================
// EXPORTS
// =========================================
const upload = multer({
  storage: storageProducts,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
export default upload;

export const uploadUser = multer({
  storage: storageUsers,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});