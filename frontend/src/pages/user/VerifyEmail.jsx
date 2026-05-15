import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const VerifyEmail = () => {
  return (
    <section className="py-20">
      <Container>

        <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-8">

          {/* Heading */}
          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
              Verify Your Email
            </h1>

            <p className="text-gray-500 mt-2">
              Enter the verification PIN sent to your email
            </p>

          </div>

          {/* Form */}
          <form className="space-y-5">

            <Input
              type="text"
              placeholder="Enter verification PIN"
            />

            <Button
              type="submit"
              className="w-full"
            >
              Verify Email
            </Button>

          </form>

        </div>

      </Container>
    </section>
  );
};

export default VerifyEmail;