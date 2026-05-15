import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const Register = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <Container>

        <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-8">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create Account
            </h1>

            <p className="text-gray-500 mt-2">
              Join FoodieHub and start ordering delicious meals
            </p>
          </div>

          {/* Form */}
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();

              navigate("/verify-email");
            }}
          >

            <Input
              type="text"
              placeholder="Enter your full name"
            />

            <Input
              type="email"
              placeholder="Enter your email"
            />

            <Input
              type="password"
              placeholder="Create password"
            />

            <Input
              type="password"
              placeholder="Confirm password"
            />

            <Button
              type="submit"
              className="w-full"
            >
              Create Account
            </Button>

          </form>

          {/* Bottom Link */}
          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}

            <Link
              to="/login"
              className="
                text-orange-500
                font-medium
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