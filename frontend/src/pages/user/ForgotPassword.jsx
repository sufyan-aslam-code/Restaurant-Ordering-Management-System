import { useState } from "react";

import {
  Mail,
  ShieldCheck,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";
import { requestPasswordReset } from "../../api/auth";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await requestPasswordReset({ email });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to send the reset link right now."
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
              Forgot Password
            </h1>

            <p
              className="
                text-gray-500
                dark:text-gray-400
                text-lg
                leading-relaxed
              "
            >
              Enter your email address to receive
              a verification PIN for resetting
              your password.
            </p>

          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>

            {message ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {/* Email */}
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
                className="
                  pl-12
                  py-4
                  rounded-2xl
                "
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
              {loading ? "Sending Link..." : "Send Reset Link"}
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
            We&apos;ll send a secure verification
            code to your registered email address.
          </p>

        </div>

      </Container>

    </section>
  );
};

export default ForgotPassword;