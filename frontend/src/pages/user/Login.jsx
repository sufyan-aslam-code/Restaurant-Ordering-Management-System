import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
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

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await loginUser(formData);

      login({
        accessToken: response.data.accessToken,
        user: response.data.user,
      });

      navigate(response.data.user.role === "admin" ? "/admin" : "/");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to log in right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email.trim() !== "" && formData.password !== "";

  return (
    <section
      className="
        min-h-screen
        bg-linear-to-br
        from-orange-50
        via-white
        to-orange-100
        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950
        flex
        items-center
        justify-center
        py-16
      "
    >

      <Container>

        <div
          className="
            max-w-lg
            mx-auto
            bg-white/90
            dark:bg-slate-800/90
            theme-surface
            backdrop-blur-xl
            shadow-2xl
            rounded-3xl
            border
            border-white/40 dark:border-gray-700
            p-10
          "
        >

          {/* Logo */}
          <div className="flex justify-center mb-6">

            <div
              className="
                w-20
                h-20
                rounded-3xl
                bg-orange-500
                flex
                items-center
                justify-center
                shadow-lg
              "
            >

              <LockKeyhole
                size={36}
                className="text-white"
              />

            </div>

          </div>

          {/* Heading */}
          <div className="text-center mb-10">

            <h1
              className="
                text-4xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-3
              "
            >
              Welcome Back
            </h1>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                text-lg
                leading-relaxed
              "
            >
              Login to continue ordering your
              favorite meals from FoodieHub.
            </p>

          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-3">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : null}

            {/* Email */}
            <div>
              <div className="relative">

                <Mail
                  size={20}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`pl-12 py-4 rounded-2xl ${fieldErrors.email ? "border-red-500" : ""}`}
                />

              </div>
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">

                <LockKeyhole
                  size={20}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`pl-12 pr-12 py-4 rounded-2xl ${fieldErrors.password ? "border-red-500" : ""}`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-gray-600
                    dark:hover:text-gray-300
                    transition
                  "
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
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">

              <Link
                to="/forgot-password"
                className="
                  text-sm
                  font-medium
                  text-orange-500
                  hover:text-orange-600
                  transition
                "
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="
                w-full
                py-4
                rounded-2xl
                text-lg
                shadow-lg
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">

            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />

            <span className="text-sm text-gray-400 dark:text-gray-500">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />

          </div>

          {/* Bottom Link */}
          <p
            className="
              text-center
              text-gray-500
              dark:text-gray-400
              text-base
            "
          >
            Don&apos;t have an account?{" "}

            <Link
              to="/register"
              className="
                text-orange-500
                dark:text-orange-400
                font-semibold
                hover:text-orange-600
                transition
              "
            >
              Create Account
            </Link>

          </p>

        </div>

      </Container>

    </section>
  );
};

export default Login;
