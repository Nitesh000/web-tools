import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';
import { SITE_CONFIG } from '../utils/constants';

export default function TermsPage() {
  const lastUpdated = 'January 15, 2024';

  return (
    <>
      <SEOHead
        title="Terms of Service"
        description="Read the Terms of Service for Web Tools Suite. Understand your rights and responsibilities when using our free online tools."
        keywords={['terms of service', 'terms and conditions', 'user agreement', 'legal']}
        canonicalUrl={`${SITE_CONFIG.url}/terms`}
      />

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header */}
        <section className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {/* Introduction */}
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Welcome to {SITE_CONFIG.name}. By accessing or using our website and tools, you agree
                to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>

              {/* Section 1: Service Description */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                1. Service Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {SITE_CONFIG.name} provides a collection of free online tools for file processing,
                including but not limited to:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Image editing, compression, and conversion tools</li>
                <li>Background removal and image manipulation</li>
                <li>QR code generation</li>
                <li>Password generation</li>
                <li>Color picking and palette creation</li>
                <li>Other utility tools as available on our website</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                All tools process files locally in your browser using client-side technologies.
                No files are uploaded to our servers unless explicitly stated otherwise for
                specific features.
              </p>

              {/* Section 2: Acceptance of Terms */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                2. Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                By accessing or using {SITE_CONFIG.name}, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our services.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify these terms at any time. Continued use of the
                service after any modifications constitutes acceptance of the updated terms.
              </p>

              {/* Section 3: User Responsibilities */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                3. User Responsibilities
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                When using our services, you agree to:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Use the tools only for lawful purposes</li>
                <li>Not attempt to reverse engineer, decompile, or disassemble our software</li>
                <li>Not use our services to process illegal content</li>
                <li>Not attempt to interfere with or disrupt the service or servers</li>
                <li>Not use automated systems or bots to access the service in a manner that sends
                    more requests than a human could reasonably produce</li>
                <li>Comply with all applicable local, state, national, and international laws</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                You are solely responsible for:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>The files you choose to process using our tools</li>
                <li>Ensuring you have the right to process and modify the files</li>
                <li>Maintaining the security of your device and data</li>
                <li>Creating backups of your original files before processing</li>
              </ul>

              {/* Section 4: Intellectual Property */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                4. Intellectual Property
              </h2>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Our Intellectual Property
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The {SITE_CONFIG.name} website, including its design, code, graphics, logos, and
                content, is owned by us and protected by copyright, trademark, and other intellectual
                property laws. You may not copy, modify, distribute, or create derivative works
                based on our intellectual property without explicit written permission.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">
                Your Content
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You retain all rights to the files and content you process using our tools. Since
                all processing happens locally in your browser, we never have access to or claim
                any rights over your content.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                You represent and warrant that you own or have the necessary rights to all files
                you process, and that your use of our tools does not infringe on any third party's
                intellectual property rights.
              </p>

              {/* Section 5: Disclaimer of Warranties */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                5. Disclaimer of Warranties
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
                KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Implied warranties of merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or reliability of results</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                We do not warrant that:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>The service will be uninterrupted, secure, or error-free</li>
                <li>The results obtained from using the service will be accurate or reliable</li>
                <li>The quality of the service will meet your expectations</li>
                <li>Any errors in the service will be corrected</li>
              </ul>

              {/* Section 6: Limitation of Liability */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                6. Limitation of Liability
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                TO THE FULLEST EXTENT PERMITTED BY LAW, {SITE_CONFIG.name.toUpperCase()} AND ITS
                OPERATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Loss of profits, data, use, or goodwill</li>
                <li>Service interruption or computer damage</li>
                <li>Cost of procurement of substitute services</li>
                <li>Any damages arising from the use or inability to use our services</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                This limitation applies regardless of the legal theory on which the claim is based,
                even if we have been advised of the possibility of such damages.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU (IF ANY)
                FOR USING OUR SERVICES IN THE TWELVE MONTHS PRECEDING THE CLAIM.
              </p>

              {/* Section 7: Indemnification */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                7. Indemnification
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You agree to indemnify, defend, and hold harmless {SITE_CONFIG.name}, its operators,
                affiliates, and their respective officers, directors, employees, and agents from
                and against any claims, liabilities, damages, losses, and expenses (including
                reasonable attorneys' fees) arising out of or in any way connected with:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Your use of our services</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any rights of another party</li>
                <li>Any content you process using our tools</li>
              </ul>

              {/* Section 8: Termination */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                8. Termination
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to terminate or suspend access to our services immediately,
                without prior notice or liability, for any reason, including but not limited to:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Breach of these Terms of Service</li>
                <li>Conduct that we believe is harmful to other users or our services</li>
                <li>Requests by law enforcement or government agencies</li>
                <li>Extended periods of inactivity</li>
                <li>Technical or security issues</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                Upon termination, your right to use the services will immediately cease. Since
                we do not store your data, no data deletion is necessary upon termination.
              </p>

              {/* Section 9: Service Modifications */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                9. Service Modifications
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify, suspend, or discontinue any part of our services
                at any time without notice. We shall not be liable to you or any third party for
                any modification, suspension, or discontinuance of the services.
              </p>

              {/* Section 10: Governing Law */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                10. Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                These Terms of Service shall be governed by and construed in accordance with the
                laws of the jurisdiction in which {SITE_CONFIG.name} operates, without regard to
                its conflict of law provisions.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Any disputes arising under or in connection with these terms shall be subject to
                the exclusive jurisdiction of the courts in that jurisdiction.
              </p>

              {/* Section 11: Severability */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                11. Severability
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                If any provision of these Terms of Service is found to be unenforceable or invalid,
                that provision shall be limited or eliminated to the minimum extent necessary, and
                the remaining provisions shall remain in full force and effect.
              </p>

              {/* Section 12: Contact */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                12. Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Email: legal@webtools.example.com</li>
                <li>Website: <Link to="/about" className="text-blue-600 dark:text-blue-400 hover:underline">{SITE_CONFIG.url}/about</Link></li>
              </ul>
            </div>

            {/* Related Links */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Related Documents
              </h3>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/privacy"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Privacy Policy
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  About Us
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Back Link */}
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
