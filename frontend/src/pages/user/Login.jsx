import { Link } from "react-router-dom";

import {
  LockKeyhole,
  Mail,
} from "lucide-react";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const Login = () => {

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
                mb-3
              "
            >
              Welcome Back
            </h1>

            <p
              className="
                text-gray-500
                text-lg
                leading-relaxed
              "
            >
              Login to continue ordering your
              favorite meals from FoodieHub.
            </p>

          </div>

          {/* Form */}
          <form className="space-y-6">

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
                className="pl-12 py-4 rounded-2xl"
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
                placeholder="Enter your password"
                className="pl-12 py-4 rounded-2xl"
              />

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
              className="
                w-full
                py-4
                rounded-2xl
                text-lg
                shadow-lg
              "
            >
              Login
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
            Don&apos;t have an account?{" "}

            <Link
              to="/register"
              className="
                text-orange-500
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