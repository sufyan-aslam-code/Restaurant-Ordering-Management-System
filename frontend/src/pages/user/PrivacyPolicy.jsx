import Container from "../../components/common/Container";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Privacy & Security
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            Privacy Policy
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-8">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-200 space-y-10">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Shield size={28} className="text-orange-500" />
                Information We Collect
              </h2>

              <p className="text-gray-600 leading-7 mb-4">
                We collect information you provide directly, including your name, email address, phone number, delivery address, and payment information when you place an order.
              </p>

              <p className="text-gray-600 leading-7">
                We also automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, and pages visited.
              </p>
            </div>

            {/* Section 2 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How We Use Your Information
              </h2>

              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Process and fulfill your orders</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Send order confirmations and delivery updates</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Respond to your inquiries and support requests</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Improve our services and personalize your experience</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Send promotional offers and marketing communications</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Prevent fraud and maintain security</span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Data Security
              </h2>

              <p className="text-gray-600 leading-7">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            {/* Section 4 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Rights
              </h2>

              <p className="text-gray-600 leading-7 mb-4">
                You have the right to access, update, or delete your personal information at any time. You can also opt-out of marketing communications.
              </p>

              <p className="text-gray-600 leading-7">
                To exercise these rights, please contact us at support@foodiehub.com with your request.
              </p>
            </div>

            {/* Section 5 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>

              <p className="text-gray-600 leading-7">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>

              <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <p className="font-semibold text-gray-900">FoodieHub Support Team</p>
                <p className="text-gray-600">Email: support@foodiehub.com</p>
                <p className="text-gray-600">Phone: +92 300 1234567</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PrivacyPolicy;
