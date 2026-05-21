import Container from "../../components/common/Container";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <section className="py-20 min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <Container>
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Legal Terms
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            Terms of Service
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-8">
            Please read these terms carefully before using FoodieHub's services.
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-12 border border-gray-200 space-y-10">
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <FileText size={28} className="text-orange-500" />
                Agreement to Terms
              </h2>

              <p className="text-gray-600 leading-7">
                By accessing and using the FoodieHub platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            {/* Section 2 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Use License
              </h2>

              <p className="text-gray-600 leading-7 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on FoodieHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>

              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Modifying or copying the materials</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Using the materials for any commercial purpose or for any public display</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Attempting to decompile or reverse engineer any software contained on FoodieHub</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Removing any copyright or other proprietary notations from the materials</span>
                </li>

                <li className="flex gap-3">
                  <span className="text-orange-500 font-bold">•</span>
                  <span>Transferring the materials to another person or "mirroring" the materials on any other server</span>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Disclaimer
              </h2>

              <p className="text-gray-600 leading-7">
                The materials on FoodieHub are provided on an 'as is' basis. FoodieHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            {/* Section 4 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Limitations
              </h2>

              <p className="text-gray-600 leading-7">
                In no event shall FoodieHub or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FoodieHub, even if FoodieHub or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            {/* Section 5 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Accuracy of Materials
              </h2>

              <p className="text-gray-600 leading-7">
                The materials appearing on FoodieHub could include technical, typographical, or photographic errors. FoodieHub does not warrant that any of the materials on its website are accurate, complete, or current. FoodieHub may make changes to the materials contained on its website at any time without notice.
              </p>
            </div>

            {/* Section 6 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Links
              </h2>

              <p className="text-gray-600 leading-7">
                FoodieHub has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FoodieHub of the site. Use of any such linked website is at the user's own risk.
              </p>
            </div>

            {/* Section 7 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Modifications
              </h2>

              <p className="text-gray-600 leading-7">
                FoodieHub may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            {/* Section 8 */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Governing Law
              </h2>

              <p className="text-gray-600 leading-7">
                These terms and conditions are governed by and construed in accordance with the laws of Pakistan, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TermsOfService;
