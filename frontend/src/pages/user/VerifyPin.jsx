import {
  ShieldCheck,
  KeyRound,
  LockKeyhole,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const VerifyPin = () => {

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
              Verify PIN
            </h1>

            <p
              className="
                text-gray-500
                text-lg
                leading-relaxed
              "
            >
              Enter the verification PIN and
              create a new secure password for
              your account.
            </p>

          </div>

          {/* Form */}
          <form className="space-y-6">

            {/* PIN */}
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
              className="
                w-full
                py-4
                rounded-2xl
                text-lg
                shadow-lg
              "
            >
              Reset Password
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
            Make sure your new password is
            strong and secure for better
            account protection.
          </p>

        </div>

      </Container>

    </section>
  );
};

export default VerifyPin;