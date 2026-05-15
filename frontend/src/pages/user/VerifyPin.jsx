import Button from "../../components/common/Button";
import Container from "../../components/common/Container";
import Input from "../../components/common/Input";

const VerifyPin = () => {
  return (
    <section className="py-20">
      <Container>

        <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-8">

          <div className="text-center mb-8">

            <h1 className="text-3xl font-bold text-gray-800">
              Verify PIN
            </h1>

            <p className="text-gray-500 mt-2">
              Enter the PIN sent to your email
            </p>

          </div>

          <form className="space-y-5">

            <Input
              type="text"
              placeholder="Enter verification PIN"
            />

            <Input
              type="password"
              placeholder="Create new password"
            />

            <Input
              type="password"
              placeholder="Confirm new password"
            />

            <Button className="w-full">
              Reset Password
            </Button>

          </form>

        </div>

      </Container>
    </section>
  );
};

export default VerifyPin;