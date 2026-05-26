import express from "express";

import {
  register,
  login,
  verifyEmail,
  resendVerification,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  me,
  updateProfile,
  updatePassword,
  deleteAccount, // <-- Added this import
} from "../controllers/authController.js";

import { requireAuth } from "../middlewares/authMiddleware.js";
import upload, { uploadUser } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// =========================================
// AUTH ROUTES
// =========================================

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// =========================================
// EMAIL VERIFICATION
// =========================================

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// =========================================
// PASSWORD RESET
// =========================================

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// =========================================
// USER PROFILE
// =========================================

// Current Logged-in User
router.get("/me", requireAuth, me);

// Update Profile
router.put(
  "/profile",
  requireAuth,
  uploadUser.single("profileImage"),
  updateProfile
);

// Update Password
router.put("/update-password", requireAuth, updatePassword);

// Delete Account
router.delete("/delete-account", requireAuth, deleteAccount); // <-- Added this route

export default router;