import Container from "../../components/common/Container";
import { Cookie } from "lucide-react";

const CookiePolicy = () => {
  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Cookie Information
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            Cookie Policy
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-8">
            Learn how FoodieHub uses cookies and similar technologies to enhance your experience.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-200 space-y-10">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Cookie size={28} className="text-orange-500" />
                What Are Cookies?
              </h2>

              <p className="text-gray-600 leading-7">
                Cookies are small text files that are placed on your computer, mobile phone, or other device when you visit our website. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
              </p>
            </div>

            {/* Section 2 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Types of Cookies We Use
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-orange-600">
                    Essential Cookies
                  </h3>

                  <p className="text-gray-600">
                    These cookies are necessary for the website to function properly. They enable you to navigate and use its features, such as accessing secure areas of the website.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-orange-600">
                    Performance Cookies
                  </h3>

                  <p className="text-gray-600">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often. The information is used to improve the website's functionality.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-orange-600">
                    Functional Cookies
                  </h3>

                  <p className="text-gray-600">
                    These cookies allow us to remember your preferences and choices to provide a personalized experience.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-orange-600">
                    Advertising Cookies
                  </h3>

                  <p className="text-gray-600">
                    These cookies are used to deliver advertisements that are relevant to you and your interests.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                How We Use Cookies
              </h2>

              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>To recognize you when you return to our website</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>To remember your preferences and settings</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>To understand how you interact with our website</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>To measure the effectiveness of marketing campaigns</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>To analyze trends and improve your user experience</span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Managing Cookies
              </h2>

              <p className="text-gray-600 leading-7 mb-4">
                Most web browsers allow you to control cookies through their settings preferences. You can:
              </p>

              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>View what cookies you have on your computer</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Delete cookies individually or in bulk</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Set your browser to not accept cookies</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Opt-out of targeted advertising cookies</span>
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Third-Party Cookies
              </h2>

              <p className="text-gray-600 leading-7">
                We may allow third parties to place cookies on our website to provide services such as analytics and advertising. These third parties have their own cookie policies and we recommend reviewing them.
              </p>
            </div>

            {/* Section 6 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Updates to This Policy
              </h2>

              <p className="text-gray-600 leading-7">
                We may update this Cookie Policy from time to time to reflect changes in technology or applicable law. Your continued use of our website means you accept these changes.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CookiePolicy;
