import Container from "../../components/common/Container";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "How can I place an order?",
    answer: "Browse our menu, select your favorite items, add them to your cart, and proceed to checkout. You can then review your order and pay.",
  },
  {
    question: "What are your delivery times?",
    answer: "We typically deliver within 30-45 minutes depending on your location and the current order volume.",
  },
  {
    question: "Do you offer vegetarian options?",
    answer: "Yes! We have a wide variety of vegetarian dishes clearly marked in our menu.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit cards, debit cards, digital wallets, and cash on delivery.",
  },
  {
    question: "Can I modify my order after placing it?",
    answer: "You can modify your order within 2 minutes of placing it. After that, contact our support team.",
  },
  {
    question: "What is your refund policy?",
    answer: "We offer full refunds if the order isn't delivered within the promised time or if there are quality issues.",
  },
];

const FAQ = () => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpanded = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Frequently Asked Questions
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            Got Questions? We Have Answers
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-8">
            Find answers to common questions about ordering, delivery, payments, and more.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="mb-4 bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-orange-50 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 text-left">
                  {faq.question}
                </h3>

                <ChevronDown
                  size={24}
                  className={`text-orange-500 shrink-0 transition-transform ${
                    expanded === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expanded === index && (
                <div className="px-6 py-5 bg-orange-50 border-t border-gray-200">
                  <p className="text-gray-600 leading-7">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FAQ;
