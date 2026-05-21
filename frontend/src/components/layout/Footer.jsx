import Container from "../common/Container";
import { Link } from "react-router-dom";
import { Phone, Mail, MessageSquare, Send, Heart } from "lucide-react";
import { useState } from "react";
import client from "../../api/client";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const supportLinks = [
  { label: "Help Center", path: "/help-center" },
  { label: "FAQs", path: "/faq" },
  { label: "Track Order", path: "/track-order" },
  { label: "Feedback", path: "/feedback" },
];

const policyLinks = [
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms of Service", path: "/terms-of-service" },
  { label: "Cookie Policy", path: "/cookie-policy" },
];

const socialLinks = [
  { icon: Mail, label: "Email", url: "#" },
  { icon: Phone, label: "Phone", url: "#" },
  { icon: MessageSquare, label: "Message", url: "#" },
  { icon: Heart, label: "Follow", url: "#" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribeMessage, setSubscribeMessage] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setSubscribeMessage({ type: "error", text: "Please enter a valid email" });
      setTimeout(() => setSubscribeMessage(null), 3000);
      return;
    }

    try {
      await client.post("newsletter/subscribe", { email: email.trim().toLowerCase() });
      setSubscribeMessage({ type: "success", text: "Thank you for subscribing!" });
      setEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);
      setSubscribeMessage({ type: "error", text: err?.response?.data?.message || "Unable to subscribe right now." });
    } finally {
      setTimeout(() => setSubscribeMessage(null), 3000);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-gray-800 mt-20">
      <Container>
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div>
            <h2 className="text-3xl font-bold text-orange-500 mb-3">
              FoodieHub
            </h2>

            <p className="text-gray-600 dark:text-gray-400 leading-7">
              Delicious food delivered fast with a modern online ordering experience.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                    title={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          <div>
            <h3 className="text-lg font-semibold text-orange-500 mb-6">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-700 dark:text-gray-400 hover:text-orange-500 transition duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold text-orange-500 mb-6">
              Support
            </h3>

            <ul className="space-y-3 text-gray-700">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                      to={link.path}
                      className="text-gray-700 dark:text-gray-400 hover:text-orange-500 transition cursor-pointer"
                    >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h3 className="text-lg font-semibold text-orange-500 mb-6">
              Newsletter
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe for exclusive offers and updates
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700 focus:border-orange-500 focus:outline-none transition"
                />

                <button
                  type="submit"
                  className="px-5 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg transition duration-300 flex items-center gap-2 font-semibold"
                >
                  <Send size={18} />
                </button>
              </div>

              {subscribeMessage && (
                <p
                  className={`mt-3 text-sm font-semibold ${
                    subscribeMessage.type === "success"
                      ? "text-emerald-500"
                      : "text-rose-500"
                  }`}
                >
                  {subscribeMessage.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 FoodieHub. All rights reserved.
            </p>

            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              {policyLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="hover:text-orange-500 transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
