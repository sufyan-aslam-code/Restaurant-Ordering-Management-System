import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Contact = () => {
  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <Container>

        {/* Heading */}
        <div className="text-center mb-14">

          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>

          <p className="max-w-2xl mx-auto text-gray-500 leading-8">
            Have questions, feedback, or need support?
            We would love to hear from you.
          </p>

        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left Side */}
          <div
            className="
              bg-white
              rounded-3xl
              shadow-md
              p-8
            "
          >

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Get In Touch
            </h2>

            <div className="space-y-6">

              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Address
                </h3>

                <p className="text-gray-500">
                  FoodieHub, Main City Center,
                  Lahore, Pakistan
                </p>

              </div>

              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Phone
                </h3>

                <p className="text-gray-500">
                  +92 300 1234567
                </p>

              </div>

              <div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Email
                </h3>

                <p className="text-gray-500">
                  support@foodiehub.com
                </p>

              </div>

            </div>

          </div>

          {/* Right Side */}
          <div
            className="
              bg-white
              rounded-3xl
              shadow-md
              p-8
            "
          >

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send Message
            </h2>

            <form className="space-y-5">

              <Input
                type="text"
                placeholder="Enter your full name"
              />

              <Input
                type="email"
                placeholder="Enter your email"
              />

              <textarea
                rows="6"
                placeholder="Write your message..."
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  resize-none
                  transition-all
                  duration-300
                  focus:border-orange-500
                  focus:ring-4
                  focus:ring-orange-100
                "
              />

              <Button
                type="submit"
                className="w-full"
              >
                Send Message
              </Button>

            </form>

          </div>

        </div>

      </Container>
    </section>
  );
};

export default Contact;