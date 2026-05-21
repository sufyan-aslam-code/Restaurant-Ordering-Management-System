import { Router } from "express";

import {
  forgotPassword,
  login,
  logout,
  me,
  refresh,
  register,
  resendVerification,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", requireAuth, me);
router.patch("/profile", requireAuth, upload.single("profileImage"), updateProfile);
router.get("/verify-email", verifyEmail);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;