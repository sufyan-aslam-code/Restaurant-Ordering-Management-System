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
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState(null);
  const noticeTimer = useRef(null);

  const showNotice = (type, message) => {
    if (noticeTimer.current) {
      window.clearTimeout(noticeTimer.current);
    }

    setNotice({ type, message });
    noticeTimer.current = window.setTimeout(() => {
      setNotice(null);
      noticeTimer.current = null;
    }, 3000);
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const userName = (formData.get("user_name") || "").toString().trim();
    const userEmail = (formData.get("user_email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!userName || !userEmail || !message) {
      showNotice("error", "Please fill in all fields before sending.");
      return;
    }

    setIsSending(true);

    try {
      await emailjs.sendForm(
        "service_n44epap",
        "template_zuefci8",
        form.current,
        "iyyMDsxDryPlhA3an",
      );

      showNotice("success", "Message sent successfully!");
      formElement.reset();
    } catch (error) {
      showNotice("error", "Failed to send message. Please try again.");
      console.log(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section
      className="
        py-20
        min-h-screen
        bg-linear-to-br
        from-orange-50
        via-white
        to-orange-100
        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950
      "
    >
      {notice && (
        <div className="fixed top-24 right-6 z-50 w-[min(92vw,32rem)]">
          <div
            className={`rounded-3xl px-7 py-6 shadow-2xl border backdrop-blur-md text-lg font-semibold leading-relaxed ${
              notice.type === "success"
                ? "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                : "border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400"
            }`}
          >
            {notice.message}
          </div>
        </div>
      )}

      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span
            className="
              inline-block
              bg-orange-100
              dark:bg-orange-500/15
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
              dark:text-gray-100
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
              dark:text-gray-400
              leading-8
            "
          >
            Whether you have questions, feedback, partnership inquiries, or need
            support, our team is always ready to help you.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left Side */}
          <div
            className="
              bg-white/90
              dark:bg-slate-800/90
              theme-surface
              backdrop-blur-xl
              rounded-3xl
              shadow-2xl
              border
              border-white/40 dark:border-gray-700
              p-10
            "
          >
            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                dark:text-gray-100
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
                  <MapPin size={24} className="text-orange-500" />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      dark:text-gray-100
                      mb-2
                    "
                  >
                    Address
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 leading-7">
                    FoodieHub Headquarters, Main City Center, Lahore, Pakistan
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
                  <Phone size={24} className="text-orange-500" />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      dark:text-gray-100
                      mb-2
                    "
                  >
                    Phone
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400">+92 300 1234567</p>
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
                  <Mail size={24} className="text-orange-500" />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      dark:text-gray-100
                      mb-2
                    "
                  >
                    Email
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400">support@foodiehub.com</p>
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
                  <Clock3 size={24} className="text-orange-500" />
                </div>

                <div>
                  <h3
                    className="
                      text-xl
                      font-semibold
                      text-gray-900
                      dark:text-gray-100
                      mb-2
                    "
                  >
                    Working Hours
                  </h3>

                  <p className="text-gray-500 dark:text-gray-400 leading-7">
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
              dark:bg-slate-800/90
              theme-surface
              backdrop-blur-xl
              rounded-3xl
              shadow-2xl
              border
              border-white/40 dark:border-gray-700
              p-10
            "
          >
            <h2
              className="
                text-3xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-10
              "
            >
              Send Message
            </h2>

            <form ref={form} onSubmit={sendEmail} className="space-y-6">
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
            dark:text-gray-500
          "
                />

                <input
                  type="text"
                  name="user_name"
                  placeholder="Enter your full name"
                  className="
    w-full
    pl-12
    py-4
    rounded-2xl
    border
    border-gray-300 dark:border-gray-700
    bg-white theme-surface
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
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
            dark:text-gray-500
          "
                />

                <input
                  type="email"
                  name="user_email"
                  placeholder="Enter your email"
                  className="
    w-full
    pl-12
    py-4
    rounded-2xl
    border
    border-gray-300 dark:border-gray-700
    bg-white theme-surface
    text-gray-900 dark:text-gray-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
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
            dark:text-gray-500
          "
                />

                <textarea
                  name="message"
                  rows="6"
                  placeholder="Write your message..."
                  className="
    w-full
    border
    border-gray-300
            dark:border-gray-700
    rounded-2xl
    pl-12
    pr-4
    py-4
    outline-none
            bg-white theme-surface
            text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 dark:placeholder:text-gray-500
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
                disabled={isSending}
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
                {isSending ? "Sending Message..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Contact;
