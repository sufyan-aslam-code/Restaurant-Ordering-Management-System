import { Link } from "react-router-dom";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const Login = () => {
  return (
    <section className="py-20">
      <Container>

        <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-8">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back
            </h1>

            <p className="text-gray-500 mt-2">
              Login to continue ordering your favorite food
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">

            <Input
              type="email"
              placeholder="Enter your email"
            />

            <Input
              type="password"
              placeholder="Enter your password"
            />

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="
                  text-sm
                  text-orange-500
                  hover:text-orange-600
                  transition
                "
              >
                Forgot Password?
              </Link>
            </div>

            <Button className="w-full">
              Login
            </Button>

          </form>

          {/* Bottom Link */}
          <p className="text-center text-gray-500 mt-6">
            Don&apos;t have an account?{" "}

            <Link
              to="/register"
              className="
                text-orange-500
                font-medium
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