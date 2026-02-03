import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';
import { SITE_CONFIG } from '../utils/constants';

export default function PrivacyPage() {
  const lastUpdated = 'January 15, 2024';

  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description="Learn how Web Tools Suite protects your privacy. All file processing happens locally in your browser - we never collect or store your files."
        keywords={['privacy policy', 'data protection', 'GDPR', 'privacy', 'security']}
        canonicalUrl={`${SITE_CONFIG.url}/privacy`}
      />

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header */}
        <section className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy Policy
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
              <div className="mb-12 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mt-0 mb-3">
                  Our Privacy Commitment
                </h2>
                <p className="text-blue-800 dark:text-blue-200 mb-0">
                  At {SITE_CONFIG.name}, your privacy is our top priority. Unlike most online tools,
                  we process all your files directly in your browser. <strong>Your files never leave
                  your device</strong>, and we never have access to your data.
                </p>
              </div>

              {/* Section 1: Local Processing */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                1. Local File Processing
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                All file processing on {SITE_CONFIG.name} happens entirely within your web browser
                using client-side technologies such as JavaScript and WebAssembly. This means:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Your files are never uploaded to our servers</li>
                <li>We cannot see, access, or store your files</li>
                <li>Processing happens on your device using your hardware</li>
                <li>Once you close the browser tab, all file data is removed from memory</li>
                <li>Your files remain completely private and under your control</li>
              </ul>

              {/* Section 2: Data We Don't Collect */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                2. Data We Do Not Collect
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We have a strict no-data-collection policy. We do NOT collect:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Files you process using our tools</li>
                <li>Personal identification information</li>
                <li>Email addresses (no signup required)</li>
                <li>Payment information (all tools are free)</li>
                <li>Location data</li>
                <li>Browsing history on other websites</li>
              </ul>

              {/* Section 3: Cookies */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                3. Cookies and Local Storage
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We use cookies and local storage only for essential functionality and to improve
                your experience:
              </p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Essential Cookies
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Theme Preference:</strong> Remember your light/dark mode choice</li>
                <li><strong>Cookie Consent:</strong> Remember your cookie preferences</li>
                <li><strong>Tool Settings:</strong> Save your preferred settings for tools</li>
              </ul>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">
                Optional Cookies
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Recently Used Tools:</strong> Quick access to your frequently used tools</li>
                <li><strong>Favorites:</strong> Remember which tools you have marked as favorites</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                You can clear these cookies at any time through your browser settings. The site
                will continue to function normally without them.
              </p>

              {/* Section 4: Third-Party Services */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                4. Third-Party Services
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may use the following third-party services:
              </p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Analytics (Optional)
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We may use privacy-focused analytics to understand how our tools are used and
                to improve the service. If enabled, analytics collect:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Page views and tool usage (which tools are popular)</li>
                <li>General geographic region (country level only)</li>
                <li>Browser and device type</li>
                <li>Referral sources</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                Analytics do NOT collect personal information, and we do NOT track individual
                users across sessions. You can opt out of analytics through our cookie consent banner.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6">
                Content Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We may use Content Delivery Networks (CDNs) to serve static files efficiently.
                These services may log standard server access information (IP address, timestamp)
                according to their own privacy policies.
              </p>

              {/* Section 5: GDPR */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                5. GDPR Compliance
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {SITE_CONFIG.name} is designed to be compliant with the General Data Protection
                Regulation (GDPR) and other privacy regulations. Because we do not collect or
                process personal data, most GDPR requirements do not apply to our service. However,
                we maintain the following practices:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Data Minimization:</strong> We collect no personal data</li>
                <li><strong>Transparency:</strong> This policy clearly explains our practices</li>
                <li><strong>Consent:</strong> Cookie consent is obtained before setting non-essential cookies</li>
                <li><strong>Right to Erasure:</strong> Since we do not store your data, there is nothing to delete</li>
                <li><strong>Data Portability:</strong> Your files remain on your device, fully under your control</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                For users in the European Union, you have the right to:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Access any personal data we hold (we hold none)</li>
                <li>Correct any inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>

              {/* Section 6: Children's Privacy */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                6. Children's Privacy
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Our service is not directed at children under 13 years of age. We do not knowingly
                collect personal information from children. Since we do not require account creation
                or collect personal data, there is no personal information at risk.
              </p>

              {/* Section 7: Security */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                7. Security Measures
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We implement various security measures to protect your experience:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>HTTPS:</strong> All connections are encrypted using TLS/SSL</li>
                <li><strong>No Server Storage:</strong> Files cannot be breached because they are never stored</li>
                <li><strong>Regular Updates:</strong> We keep our software dependencies up to date</li>
                <li><strong>Security Headers:</strong> We implement security headers to prevent common attacks</li>
              </ul>

              {/* Section 8: Changes */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                8. Changes to This Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                We may update this privacy policy from time to time. We will notify users of any
                significant changes by posting a notice on our website. The "Last updated" date
                at the top of this policy indicates when it was last revised.
              </p>

              {/* Section 9: Contact */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-12">
                9. Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about this Privacy Policy or our practices, please
                contact us at:
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li>Email: privacy@webtools.example.com</li>
                <li>Website: <Link to="/about" className="text-blue-600 dark:text-blue-400 hover:underline">{SITE_CONFIG.url}/about</Link></li>
              </ul>
            </div>

            {/* Back Link */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
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
