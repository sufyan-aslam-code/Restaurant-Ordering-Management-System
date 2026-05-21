import Container from "../../components/common/Container";
import { Mail, Phone, MessageSquare, Clock } from "lucide-react";
import Button from "../../components/common/Button";

const HelpCenter = () => {
  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Help Center
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            We're Here to Help
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-8">
            Find support and assistance from our dedicated customer service team.
          </p>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Email Support */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
              <Mail size={28} className="text-orange-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Support</h3>

            <p className="text-gray-600 mb-6">
              Send us an email and we'll respond within 24 hours.
            </p>

            <p className="font-semibold text-orange-500 mb-6">support@foodiehub.com</p>

            <Button className="w-full rounded-xl" variant="primary">
              Send Email
            </Button>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
              <Phone size={28} className="text-orange-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Phone Support</h3>

            <p className="text-gray-600 mb-6">
              Call us during business hours for immediate assistance.
            </p>

            <p className="font-semibold text-orange-500 mb-6">+92 300 1234567</p>

            <Button className="w-full rounded-xl" variant="primary">
              Call Now
            </Button>
          </div>

          {/* Live Chat */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
              <MessageSquare size={28} className="text-orange-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Live Chat</h3>

            <p className="text-gray-600 mb-6">
              Chat with our support team in real-time.
            </p>

            <p className="font-semibold text-orange-500 mb-6">Available 9 AM - 11 PM</p>

            <Button className="w-full rounded-xl" variant="primary">
              Start Chat
            </Button>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-5">
              <Clock size={28} className="text-orange-500" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">Business Hours</h3>

            <p className="text-gray-600 mb-6">We're available 7 days a week to assist you.</p>

            <div className="text-gray-700 font-semibold space-y-2">
              <p>Monday - Sunday</p>
              <p className="text-orange-500">9:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Common Solutions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                <span className="font-bold text-orange-500">1</span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tracking Your Order</h4>
                <p className="text-gray-600">
                  Use the tracking feature in your account to monitor your delivery in real-time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                <span className="font-bold text-orange-500">2</span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Payment Issues</h4>
                <p className="text-gray-600">
                  If your payment fails, try a different payment method or contact support.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                <span className="font-bold text-orange-500">3</span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Canceling Orders</h4>
                <p className="text-gray-600">
                  Orders can be cancelled within 2 minutes. After that, contact support.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-1">
                <span className="font-bold text-orange-500">4</span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Refunds</h4>
                <p className="text-gray-600">
                  Refunds are processed within 5-7 business days to your original payment method.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HelpCenter;
