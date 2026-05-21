import Container from "../../components/common/Container";
import { Star, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating && message.trim()) {
      setSubmitted(true);
      setRating(0);
      setMessage("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Your Feedback Matters
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            Share Your Experience
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-8">
            Help us improve by sharing your feedback about our service, food quality, and delivery experience.
          </p>
        </div>

        {/* Feedback Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-10 border border-gray-200">
          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 font-semibold text-center">
              Thank you for your feedback! We appreciate it.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-gray-700 font-semibold mb-4">
                How would you rate your experience?
              </label>

              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={`${
                        star <= rating
                          ? "fill-orange-500 text-orange-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Tell us more about your experience
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, suggestions, or concerns..."
                rows={6}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none resize-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!rating || !message.trim()}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold rounded-2xl transition duration-300 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Why Feedback Matters */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-5">
              <MessageSquare size={32} className="text-orange-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
              We Listen
            </h3>

            <p className="text-gray-600">
              Your feedback helps us understand what matters most to you.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-5">
              <Star size={32} className="text-orange-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
              We Improve
            </h3>

            <p className="text-gray-600">
              Your suggestions drive continuous improvements to our service.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-5">
              <Send size={32} className="text-orange-500" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3">
              We Care
            </h3>

            <p className="text-gray-600">
              Your satisfaction is our top priority and mission.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Feedback;
