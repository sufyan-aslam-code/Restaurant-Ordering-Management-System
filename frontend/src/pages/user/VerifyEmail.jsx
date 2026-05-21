import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ShieldCheck,
  Mail,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import {
  resendVerificationEmail,
  verifyEmailToken,
} from "../../api/auth";

const VerifyEmail = () => {

  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [tokenStatus, setTokenStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      return;
    }

    const verifyToken = async () => {
      setTokenStatus("verifying");
      setMessage("");
      setError("");

      try {
        const response = await verifyEmailToken({ token });
        setMessage(response.data.message);
        setTokenStatus("verified");
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ||
            "Unable to verify the email link right now."
        );
        setTokenStatus("failed");
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleResend = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await resendVerificationEmail({ email });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to resend the verification email right now."
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
              Verify Your Email
            </h1>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                text-lg
                leading-relaxed
              "
            >
              {tokenStatus === "verifying"
                ? "Verifying your email address..."
                : "Open the verification link sent to your email address to complete account verification."}
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

          {tokenStatus === "verified" ? (
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleResend}>

              {/* Email Input */}
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
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="pl-12 py-4 rounded-2xl"
                />

              </div>

              {/* Button */}
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-4
                  rounded-2xl
                  text-lg
                  shadow-lg
                "
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </Button>

            </form>
          )}

          {/* Resend */}
          <div className="text-center mt-8">

            <p className="text-gray-500 text-sm mb-2">
              Didn&apos;t receive the email? Check your spam folder.
            </p>

            {tokenStatus !== "verified" ? (
              <button
                type="button"
                onClick={handleResend}
                className="
                  text-orange-500
                  font-semibold
                  hover:text-orange-600
                  transition
                "
              >
                Resend Verification Email
              </button>
            ) : null}

          </div>

        </div>

      </Container>

    </section>
  );
};

export default VerifyEmail;