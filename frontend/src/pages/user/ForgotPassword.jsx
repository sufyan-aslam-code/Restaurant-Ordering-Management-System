import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <Container>

        <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
              Forgot Password
            </h1>

            <p className="text-gray-500 mt-2">
              Enter your email to receive verification PIN
            </p>

          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();

              navigate("/verify-pin");
            }}
          >

            <Input
              type="email"
              placeholder="Enter your email"
            />

            <Button type="submit" className="w-full">
              Send PIN
            </Button>

          </form>

        </div>

      </Container>
    </section>
  );
};

export default ForgotPassword;