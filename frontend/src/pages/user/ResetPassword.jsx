import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import { resetPasswordWithToken } from "../../api/auth";

const ResetPassword = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setToken(searchParams.get("token") || "");
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await resetPasswordWithToken({
        token,
        password,
        confirmPassword,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to reset your password right now."
      );
    } finally {
      setLoading(false);
    }
  };

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

          {/* Icon */}
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

              <ShieldCheck
                size={38}
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
              Reset Password
            </h1>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                text-lg
                leading-relaxed
              "
            >
              Use the reset link from your email to create a new secure password.
            </p>

          </div>

          {message ? (
            <div className="mb-6 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          ) : null}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {!token ? (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 px-4 py-3 text-sm text-amber-800 dark:text-amber-400">
                Your reset token is missing. Please use the link from your email.
              </div>
            ) : null}

            {/* New Password */}
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
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create new password"
                className="
                  pl-12
                  py-4
                  rounded-2xl
                "
              />

            </div>

            {/* Confirm Password */}
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
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                className="
                  pl-12
                  py-4
                  rounded-2xl
                "
              />

            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading || !token}
              className="
                w-full
                py-4
                rounded-2xl
                text-lg
                shadow-lg
              "
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>

          </form>

          {/* Bottom Text */}
          <p
            className="
              text-center
              text-gray-400
              dark:text-gray-500
              text-sm
              mt-8
              leading-relaxed
            "
          >
            Remember to keep your new password strong and unique.
          </p>

          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-orange-500 dark:text-orange-400 hover:text-orange-600 transition"
            >
              Request a new reset link
            </Link>
          </div>

        </div>

      </Container>

    </section>
  );
};

export default ResetPassword;