import { useNavigate } from "react-router-dom";

import {
  Mail,
  ShieldCheck,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const ForgotPassword = () => {

  const navigate = useNavigate();

  return (
    <section
      className="
        min-h-screen
        bg-gradient-to-br
        from-orange-50
        via-white
        to-orange-100
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
            backdrop-blur-xl
            shadow-2xl
            rounded-3xl
            border
            border-white/40
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
                mb-3
              "
            >
              Forgot Password
            </h1>

            <p
              className="
                text-gray-500
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
          <form
            className="space-y-6"
            onSubmit={(e) => {

              e.preventDefault();

              navigate("/verify-pin");

            }}
          >

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
              className="
                w-full
                py-4
                rounded-2xl
                text-lg
                shadow-lg
              "
            >
              Send Verification PIN
            </Button>

          </form>

          {/* Bottom Text */}
          <p
            className="
              text-center
              text-gray-400
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