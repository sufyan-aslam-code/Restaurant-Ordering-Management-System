import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { query } from "../config/db.js";
import { sendMail } from "../utils/email.js";
import {
  createAccessToken,
  createRefreshToken,
  generateRandomToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/token.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const refreshTokenMaxAgeMs = 7 * 24 * 60 * 60 * 1000;

const normalizeEmail = (email) => email.trim().toLowerCase();

const toPublicUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  profileImageUrl: user.profileImageUrl || "",
  role: user.role,
  emailVerified: Boolean(user.emailVerified),
});

const getUserByEmail = async (email) => {
  const [rows] = await query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  return rows[0] || null;
};

const getUserById = async (id) => {
  const [rows] = await query(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [id]
  );

  return rows[0] || null;
};

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${frontendUrl}/verify-email?token=${token}&email=${encodeURIComponent(
    user.email
  )}`;

  await sendMail({
    to: user.email,
    subject: "Verify your FoodieHub email address",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 16px;">Verify your email address</h2>
        <p>Hi ${user.fullName},</p>
        <p>Thanks for registering. Please verify your email address by clicking the button below:</p>
        <p style="margin: 24px 0;">
          <a href="${verificationLink}" style="background: #f97316; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block;">Verify Email</a>
        </p>
        <p>If the button does not work, copy this link into your browser:</p>
        <p>${verificationLink}</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(
    user.email
  )}`;

  await sendMail({
    to: user.email,
    subject: "Reset your FoodieHub password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 16px;">Reset your password</h2>
        <p>Hi ${user.fullName},</p>
        <p>Use the link below to set a new password for your account:</p>
        <p style="margin: 24px 0;">
          <a href="${resetLink}" style="background: #f97316; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block;">Reset Password</a>
        </p>
        <p>If the button does not work, copy this link into your browser:</p>
        <p>${resetLink}</p>
      </div>
    `,
  });
};

const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    ...refreshCookieOptions,
    maxAge: refreshTokenMaxAgeMs,
  });
};

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", refreshCookieOptions);
};

export const register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phoneNumber,
    } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verificationToken = generateRandomToken();
    const verificationTokenHash = hashToken(verificationToken);
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [result] = await query(
      `
        INSERT INTO users (
          fullName,
          email,
          passwordHash,
          phoneNumber,
          emailVerified,
          emailVerificationTokenHash,
          emailVerificationTokenExpiresAt
        ) VALUES (?, ?, ?, ?, 0, ?, ?)
      `,
      [
        fullName.trim(),
        normalizedEmail,
        passwordHash,
        phoneNumber.trim(),
        verificationTokenHash,
        verificationTokenExpiresAt,
      ]
    );

    const createdUser = {
      id: result.insertId,
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),
    };

    try {
      await sendVerificationEmail(createdUser, verificationToken);
    } catch (emailError) {
      await query("DELETE FROM users WHERE id = ?", [result.insertId]);
      console.error("Verification email error:", emailError);

      return res.status(502).json({
        message:
          emailError?.message ||
          emailError?.code ||
          "Account was created, but the verification email could not be sent.",
      });
    }

    return res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === "ER_ACCESS_DENIED_ERROR" || error.code === "ECONNREFUSED") {
      return res.status(500).json({
        message:
          "Database connection failed. Check your MySQL host, username, password, and that MySQL is running.",
      });
    }

    return res.status(500).json({
      message:
        error?.message ||
        "Unable to register right now. Please try again later.",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const token = req.body.token || req.query.token;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required." });
    }

    const tokenHash = hashToken(token);
    const [rows] = await query(
      `
        SELECT *
        FROM users
        WHERE emailVerificationTokenHash = ?
          AND emailVerificationTokenExpiresAt > NOW()
        LIMIT 1
      `,
      [tokenHash]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: "Verification link is invalid or expired." });
    }

    await query(
      `
        UPDATE users
        SET
          emailVerified = 1,
          emailVerificationTokenHash = NULL,
          emailVerificationTokenExpiresAt = NULL
        WHERE id = ?
      `,
      [user.id]
    );

    return res.json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    return res.status(500).json({
      message: "Unable to verify email right now. Please try again later.",
    });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.json({
        message: "If the account exists, a verification email has been sent.",
      });
    }

    if (user.emailVerified) {
      return res.json({ message: "Email is already verified." });
    }

    const verificationToken = generateRandomToken();
    const verificationTokenHash = hashToken(verificationToken);
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await query(
      `
        UPDATE users
        SET
          emailVerificationTokenHash = ?,
          emailVerificationTokenExpiresAt = ?
        WHERE id = ?
      `,
      [verificationTokenHash, verificationTokenExpiresAt, user.id]
    );

    await sendVerificationEmail(user, verificationToken);

    return res.json({
      message: "A new verification email has been sent.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      message: "Unable to resend verification email right now.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const authPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    const accessToken = createAccessToken(authPayload);
    const refreshToken = createRefreshToken(authPayload);
    const refreshTokenHash = hashToken(refreshToken);
    const refreshTokenExpiresAt = new Date(Date.now() + refreshTokenMaxAgeMs);

    await query(
      `
        UPDATE users
        SET refreshTokenHash = ?, refreshTokenExpiresAt = ?
        WHERE id = ?
      `,
      [refreshTokenHash, refreshTokenExpiresAt, user.id]
    );

    setRefreshCookie(res, refreshToken);

    return res.json({
      message: "Login successful.",
      accessToken,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Unable to log in right now. Please try again later.",
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
    }

    const decodedToken = verifyRefreshToken(refreshToken);
    const user = await getUserById(decodedToken.sub);

    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Refresh token is invalid." });
    }

    const tokenMatches = hashToken(refreshToken) === user.refreshTokenHash;

    if (!tokenMatches) {
      return res.status(401).json({ message: "Refresh token is invalid." });
    }

    const authPayload = {
      sub: user.id,
      role: user.role,
      email: user.email,
    };

    const newAccessToken = createAccessToken(authPayload);
    const newRefreshToken = createRefreshToken(authPayload);

    await query(
      `
        UPDATE users
        SET refreshTokenHash = ?, refreshTokenExpiresAt = ?
        WHERE id = ?
      `,
      [
        hashToken(newRefreshToken),
        new Date(Date.now() + refreshTokenMaxAgeMs),
        user.id,
      ]
    );

    setRefreshCookie(res, newRefreshToken);

    return res.json({
      accessToken: newAccessToken,
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({ message: "Refresh token is invalid or expired." });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        const decodedToken = verifyRefreshToken(refreshToken);
        await query(
          `
            UPDATE users
            SET refreshTokenHash = NULL, refreshTokenExpiresAt = NULL
            WHERE id = ?
          `,
          [decodedToken.sub]
        );
      } catch (error) {
        // Ignore invalid tokens during logout.
      }
    }

    clearRefreshCookie(res);

    return res.json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Unable to log out right now." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await getUserByEmail(normalizedEmail);

    if (!user || !user.emailVerified) {
      return res.json({
        message:
          "If the email exists and is verified, a password reset link has been sent.",
      });
    }

    const resetToken = generateRandomToken();
    const resetTokenHash = hashToken(resetToken);
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await query(
      `
        UPDATE users
        SET
          passwordResetTokenHash = ?,
          passwordResetTokenExpiresAt = ?
        WHERE id = ?
      `,
      [resetTokenHash, resetTokenExpiresAt, user.id]
    );

    await sendPasswordResetEmail(user, resetToken);

    return res.json({
      message: "Password reset link sent to your email address.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Unable to send reset link right now.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Token, new password, and confirm password are required.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    const tokenHash = hashToken(token);
    const [rows] = await query(
      `
        SELECT *
        FROM users
        WHERE passwordResetTokenHash = ?
          AND passwordResetTokenExpiresAt > NOW()
        LIMIT 1
      `,
      [tokenHash]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or expired." });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await query(
      `
        UPDATE users
        SET
          passwordHash = ?,
          passwordResetTokenHash = NULL,
          passwordResetTokenExpiresAt = NULL,
          refreshTokenHash = NULL,
          refreshTokenExpiresAt = NULL
        WHERE id = ?
      `,
      [passwordHash, user.id]
    );

    return res.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Unable to reset password right now.",
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getUserById(req.auth.sub);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Unable to load profile." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(400).json({
        message: "Full name and phone number are required.",
      });
    }

    const userId = req.auth.sub;
    let profileImageUrl = null;

    // Get current user to check for existing image
    const currentUser = await getUserById(userId);

    // If file was uploaded, process it
    if (req.file) {
      // Delete old profile image if it exists
      if (currentUser.profileImageUrl) {
        try {
          const oldFilePath = path.join(
            __dirname,
            `../../uploads/${path.basename(currentUser.profileImageUrl)}`
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (err) {
          console.error("Error deleting old profile image:", err);
        }
      }

      // Use the new file path (relative path for storing in DB)
      profileImageUrl = `/uploads/${req.file.filename}`;
    } else if (currentUser.profileImageUrl) {
      // Keep existing image if no new file
      profileImageUrl = currentUser.profileImageUrl;
    }

    await query(
      `
        UPDATE users
        SET
          fullName = ?,
          phoneNumber = ?,
          profileImageUrl = ?
        WHERE id = ?
      `,
      [
        fullName.trim(),
        phoneNumber.trim(),
        profileImageUrl,
        userId,
      ]
    );

    const user = await getUserById(userId);

    return res.json({
      message: "Profile updated successfully.",
      user: toPublicUser(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      try {
        const filePath = path.join(__dirname, `../../uploads/${req.file.filename}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Error deleting file after error:", err);
      }
    }

    return res.status(500).json({
      message: "Unable to update profile right now.",
    });
  }
};