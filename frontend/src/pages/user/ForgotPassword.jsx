import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import { requestPasswordReset } from "../../api/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleChange = (event) => {
    const value = event.target.value;

    setEmail(value);

    if (fieldError) {
      setFieldError("");
    }

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setFieldError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setFieldError("Enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await requestPasswordReset({
        email,
      });

      setSentEmail(email);
      setEmailSent(true);
      setFieldError("");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to send reset PIN right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUseDifferentEmail = () => {
    setEmailSent(false);
    setSentEmail("");
    setEmail("");
    setError("");
    setFieldError("");
  };

  const maskedEmail = sentEmail
    ? sentEmail.replace(/(^.{2})(.*)(@.*$)/, (_, start, middle, end) => {
        return `${start}${"*".repeat(Math.max(middle.length, 3))}${end}`;
      })
    : "";

  return (
    <section
      className="
        min-h-screen
        bg-[#f8f4ee]
        dark:bg-slate-950
        flex
        items-center
        justify-center
        px-4
        py-14
      "
    >
      <Container>
        <div
          className="
            w-full
            max-w-xl
            mx-auto
            rounded-[36px]
            bg-white
            dark:bg-slate-900
            border
            border-[#f1ece4]
            dark:border-slate-800
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            overflow-hidden
          "
        >
          {/* Top Glow */}
          <div
            className="
              h-2
              w-full
              bg-gradient-to-r
              from-orange-400
              via-orange-500
              to-orange-600
            "
          />

          <div className="px-8 sm:px-12 py-12">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div
                className="
                  w-24
                  h-24
                  rounded-[30px]
                  bg-orange-500
                  flex
                  items-center
                  justify-center
                  shadow-[0_18px_40px_rgba(249,115,22,0.35)]
                "
              >
                <ShieldCheck size={42} className="text-white" />
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-10">
              <h1
                className="
                  text-4xl
                  sm:text-5xl
                  font-extrabold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  mb-4
                "
              >
                {emailSent ? "Check Your Email" : "Forgot Password"}
              </h1>

              {!emailSent ? (
                <p
                  className="
                    text-[17px]
                    leading-8
                    text-slate-500
                    dark:text-slate-400
                    max-w-md
                    mx-auto
                  "
                >
                  Enter your account email and we’ll send you a secure 6-digit
                  PIN to reset your password.
                </p>
              ) : (
                <div
                  className="
                    max-w-md
                    mx-auto
                    rounded-3xl
                    bg-orange-50
                    dark:bg-orange-500/10
                    border
                    border-orange-100
                    dark:border-orange-500/20
                    px-5
                    py-5
                  "
                >
                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-600
                      dark:text-slate-300
                      leading-7
                    "
                  >
                    We sent a verification PIN to
                  </p>

                  <p
                    className="
                      text-orange-600
                      dark:text-orange-400
                      font-bold
                      text-lg
                      mt-1
                      break-all
                    "
                  >
                    {maskedEmail}
                  </p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  mb-6
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  dark:bg-red-500/10
                  dark:border-red-500/20
                  px-4
                  py-4
                  flex
                  items-start
                  gap-3
                "
              >
                <AlertCircle
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5"
                />

                <p className="text-sm text-red-600 dark:text-red-400 leading-6">
                  {error}
                </p>
              </div>
            )}

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Email Input */}
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-slate-700
                      dark:text-slate-300
                      mb-3
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={20}
                      className="
                        absolute
                        left-5
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <Input
                      type="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`
                        h-16
                        pl-14
                        rounded-2xl
                        border-2
                        bg-[#fcfaf7]
                        dark:bg-slate-800
                        text-base
                        transition-all
                        focus:ring-4
                        focus:ring-orange-100
                        dark:focus:ring-orange-500/10
                        ${
                          fieldError
                            ? "border-red-400"
                            : "border-[#ebe4d9] dark:border-slate-700"
                        }
                      `}
                    />
                  </div>

                  {fieldError && (
                    <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
                      <AlertCircle size={14} />
                      {fieldError}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    text-lg
                    font-semibold
                    bg-orange-500
                    hover:bg-orange-600
                    shadow-[0_16px_35px_rgba(249,115,22,0.30)]
                    hover:shadow-[0_18px_45px_rgba(249,115,22,0.38)]
                    transition-all
                    duration-300
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                  "
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Sending PIN..." : "Continue"}
                    {!loading && <ArrowRight size={20} />}
                  </span>
                </Button>
              </form>
            ) : (
              <div className="space-y-5">
                {/* Continue Button */}
                <Button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/reset-password?email=${encodeURIComponent(sentEmail)}`
                    )
                  }
                  className="
                    w-full
                    h-16
                    rounded-2xl
                    text-lg
                    font-semibold
                    bg-orange-500
                    hover:bg-orange-600
                    shadow-[0_16px_35px_rgba(249,115,22,0.30)]
                    hover:shadow-[0_18px_45px_rgba(249,115,22,0.38)]
                    transition-all
                    duration-300
                  "
                >
                  <span className="flex items-center justify-center gap-2">
                    Continue to Verification
                    <ArrowRight size={20} />
                  </span>
                </Button>

                {/* Different Email */}
                <button
                  type="button"
                  onClick={handleUseDifferentEmail}
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-[#ebe4d9]
                    dark:border-slate-700
                    bg-[#fcfaf7]
                    dark:bg-slate-800
                    text-slate-700
                    dark:text-slate-300
                    font-semibold
                    hover:border-orange-300
                    hover:text-orange-600
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <RotateCcw size={18} />
                  Use Different Email
                </button>

                {/* Expire Text */}
                <p
                  className="
                    text-center
                    text-sm
                    text-slate-400
                    dark:text-slate-500
                    leading-6
                    pt-2
                  "
                >
                  The verification PIN expires in 15 minutes for security
                  reasons.
                </p>
              </div>
            )}

            {/* Footer */}
            {!emailSent && (
              <div className="text-center mt-10">
                <Link
                  to="/login"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-orange-500
                    hover:text-orange-600
                    font-semibold
                    transition
                  "
                >
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ForgotPassword;