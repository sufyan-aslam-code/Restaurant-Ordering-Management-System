import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  Send,
  User,
  MessageSquare,
} from "lucide-react";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const Contact = () => {

  return (
    <section
      className="
        py-20
        min-h-screen
        bg-gradient-to-br
        from-orange-50
        via-white
        to-orange-100
      "
    >

      <Container>

        {/* Heading */}
        <div className="text-center mb-16">

          <span
            className="
              inline-block
              bg-orange-100
              text-orange-500
              font-semibold
              px-5
              py-2
              rounded-full
              mb-5
            "
          >
            Contact FoodieHub
          </span>

          <h1
            className="
              text-5xl
              font-bold
              text-gray-900
              mb-5
            "
          >
            We’d Love To Hear From You
          </h1>

          <p
            className="
              max-w-3xl
              mx-auto
              text-lg
              text-gray-500
              leading-8
            "
          >
            Whether you have questions, feedback,
            partnership inquiries, or need support,
            our team is always ready to help you.
          </p>

        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left Side */}
          <div
            className="
              bg-white/90
              backdrop-blur-xl
              rounded-3xl
              shadow-2xl
              border
              border-white/40
              p-10
            "
          >

            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                mb-10
              "
            >
              Get In Touch
            </h2>

            <div className="space-y-8">

              {/* Address */}
              <div className="flex items-start gap-5">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <MapPin
                    size={24}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      mb-2
                    "
                  >
                    Address
                  </h3>

                  <p className="text-gray-500 leading-7">
                    FoodieHub Headquarters,
                    Main City Center,
                    Lahore, Pakistan
                  </p>

                </div>

              </div>

              {/* Phone */}
              <div className="flex items-start gap-5">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <Phone
                    size={24}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      mb-2
                    "
                  >
                    Phone
                  </h3>

                  <p className="text-gray-500">
                    +92 300 1234567
                  </p>

                </div>

              </div>

              {/* Email */}
              <div className="flex items-start gap-5">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <Mail
                    size={24}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      mb-2
                    "
                  >
                    Email
                  </h3>

                  <p className="text-gray-500">
                    support@foodiehub.com
                  </p>

                </div>

              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-5">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-orange-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >

                  <Clock3
                    size={24}
                    className="text-orange-500"
                  />

                </div>

                <div>

                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      mb-2
                    "
                  >
                    Working Hours
                  </h3>

                  <p className="text-gray-500 leading-7">
                    Monday - Sunday <br />
                    9:00 AM - 11:00 PM
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Right Side */}
          <div
            className="
              bg-white/90
              backdrop-blur-xl
              rounded-3xl
              shadow-2xl
              border
              border-white/40
              p-10
            "
          >

            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                mb-10
              "
            >
              Send Message
            </h2>

            <form className="space-y-6">

              {/* Name */}
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

              {/* Message */}
              <div className="relative">

                <MessageSquare
                  size={20}
                  className="
                    absolute
                    left-4
                    top-5
                    text-gray-400
                  "
                />

                <textarea
                  rows="6"
                  placeholder="Write your message..."
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-2xl
                    pl-12
                    pr-4
                    py-4
                    outline-none
                    resize-none
                    transition-all
                    duration-300
                    focus:border-orange-500
                    focus:ring-4
                    focus:ring-orange-100
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
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <Send size={20} />

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