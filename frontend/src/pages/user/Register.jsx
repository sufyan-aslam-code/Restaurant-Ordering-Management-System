import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  LockKeyhole,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const Register = () => {

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

              <User
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
              Create Account
            </h1>

            <p
              className="
                text-gray-500
                text-lg
                leading-relaxed
              "
            >
              Join FoodieHub and start ordering
              delicious meals in minutes.
            </p>

          </div>

          {/* Form */}
          <form
            className="space-y-6"
            onSubmit={(e) => {

              e.preventDefault();

              navigate("/verify-email");

            }}
          >

            {/* Full Name */}
            <div className="relative">

              <User
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
                placeholder="Enter your full name"
                className="
                  pl-12
                  py-4
                  rounded-2xl
                "
              />

            </div>

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

            {/* Password */}
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
                placeholder="Create password"
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
                placeholder="Confirm password"
                className="
                  pl-12
                  py-4
                  rounded-2xl
                "
              />

            </div>

            {/* Submit Button */}
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
              Create Account
            </Button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">

            <div className="flex-1 h-px bg-gray-200" />

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-200" />

          </div>

          {/* Bottom Link */}
          <p
            className="
              text-center
              text-gray-500
              text-base
            "
          >
            Already have an account?{" "}

            <Link
              to="/login"
              className="
                text-orange-500
                font-semibold
                hover:text-orange-600
                transition
              "
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