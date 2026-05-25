import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import { registerUser } from "../../api/auth";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    const cleanedPhone = phone.replace(/\D/g, "");
    return cleanedPhone.length >= 10;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phoneNumber)) {
      errors.phoneNumber =
        "Please enter a valid phone number (at least 10 digits)";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (formData.password.length > 128) {
      errors.password = "Password is too long";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setFieldErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Remove current field error
      if (newErrors[name]) {
        delete newErrors[name];
      }

      // Real-time password match validation
      const currentPassword =
        name === "password" ? value : formData.password;

      const currentConfirmPassword =
        name === "confirmPassword"
          ? value
          : formData.confirmPassword;

      if (currentConfirmPassword) {
        if (currentPassword !== currentConfirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
      }

      return newErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await registerUser(formData);

      navigate("/verify-email", {
        state: {
          email: formData.email,
        },
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to create your account right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    formData.password !== "" &&
    formData.confirmPassword !== "" &&
    formData.password === formData.confirmPassword &&
    Object.keys(fieldErrors).length === 0;

  const passwordsMatch =
    Boolean(formData.password) &&
    Boolean(formData.confirmPassword) &&
    formData.password === formData.confirmPassword;

  return (
    <section className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center py-16">
      <Container>
        <div className="max-w-lg mx-auto bg-white/90 dark:bg-slate-800/90 theme-surface backdrop-blur-xl shadow-2xl rounded-3xl border border-white/40 dark:border-gray-700 p-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-orange-500 flex items-center justify-center shadow-lg">
              <User size={38} className="text-white" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Create Account
            </h1>

            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
              Join FoodieHub and start ordering delicious meals in minutes.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="flex-shrink-0 mt-0.5"
                />

                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <div className="relative">
                <User
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className={`pl-12 py-4 rounded-2xl ${
                    fieldErrors.fullName ? "border-red-500" : ""
                  }`}
                />
              </div>

              {fieldErrors.fullName && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`pl-12 py-4 rounded-2xl ${
                    fieldErrors.email ? "border-red-500" : ""
                  }`}
                />
              </div>

              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <div className="relative">
                <Phone
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                  placeholder="Enter your phone number"
                  className={`pl-12 py-4 rounded-2xl ${
                    fieldErrors.phoneNumber ? "border-red-500" : ""
                  }`}
                />
              </div>

              {fieldErrors.phoneNumber && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {fieldErrors.phoneNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <LockKeyhole
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Create password"
                  className={`pl-12 pr-12 py-4 rounded-2xl ${
                    fieldErrors.password ? "border-red-500" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {fieldErrors.password}
                </p>
              )}

              {formData.password.length >= 8 &&
                !fieldErrors.password && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Password looks good
                  </p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <LockKeyhole
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <Input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Confirm password"
                  className={`pl-12 pr-12 py-4 rounded-2xl ${
                    fieldErrors.confirmPassword
                      ? "border-red-500"
                      : passwordsMatch
                      ? "border-green-500"
                      : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {fieldErrors.confirmPassword}
                </p>
              )}

              {passwordsMatch &&
                !fieldErrors.confirmPassword && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle size={14} />
                    Passwords match
                  </p>
                )}
            </div>

            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full py-4 rounded-2xl text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />

            <span className="text-sm text-gray-400 dark:text-gray-500">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 dark:text-orange-400 font-semibold hover:text-orange-600 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Register;