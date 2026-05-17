import {
  ShieldCheck,
  KeyRound,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const VerifyEmail = () => {

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
              Verify Your Email
            </h1>

            <p
              className="
                text-gray-500
                text-lg
                leading-relaxed
              "
            >
              Enter the verification PIN sent
              to your email address to complete
              account verification.
            </p>

          </div>

          {/* Form */}
          <form className="space-y-6">

            {/* PIN Input */}
            <div className="relative">

              <KeyRound
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
                type="text"
                placeholder="Enter verification PIN"
                className="
                  pl-12
                  py-4
                  rounded-2xl
                  tracking-widest
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
              Verify Email
            </Button>

          </form>

          {/* Resend */}
          <div className="text-center mt-8">

            <p className="text-gray-500 text-sm mb-2">
              Didn&apos;t receive the code?
            </p>

            <button
              className="
                text-orange-500
                font-semibold
                hover:text-orange-600
                transition
              "
            >
              Resend PIN
            </button>

          </div>

        </div>

      </Container>

    </section>
  );
};

export default VerifyEmail;