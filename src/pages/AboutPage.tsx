import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';
import { TOOLS, SITE_CONFIG } from '../utils/constants';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Client-Side Processing',
    description: 'All file processing happens directly in your browser using modern web technologies like WebAssembly. Your files never leave your device.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'No Sign-Up Required',
    description: 'Start using any tool immediately without creating an account. We believe tools should be accessible to everyone without barriers.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'No upload delays or server queues. Processing starts instantly because everything runs locally on your machine.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Secure & Private',
    description: 'Zero data collection, no tracking, and complete privacy. Your files and data are never transmitted to any server.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SEOHead
        title="About Us"
        description="Learn about Web Tools Suite - our mission to provide free, privacy-focused online tools that process files directly in your browser."
        keywords={['about', 'web tools', 'privacy', 'free tools', 'online tools']}
        canonicalUrl={`${SITE_CONFIG.url}/about`}
      />

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
                About {SITE_CONFIG.name}
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
                We believe that essential online tools should be free, fast, and respect your privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Our Mission
              </h2>
            </div>
            <div className="prose prose-lg dark:prose-invert mx-auto text-gray-600 dark:text-gray-300">
              <p className="text-xl leading-relaxed">
                At {SITE_CONFIG.name}, our mission is simple: provide powerful, free online tools
                that anyone can use without compromising their privacy or security.
              </p>
              <p className="leading-relaxed">
                Unlike traditional web tools that require uploading your files to remote servers,
                our tools process everything directly in your browser. This means your sensitive
                documents, personal photos, and confidential data never leave your device.
              </p>
              <p className="leading-relaxed">
                We started this project because we were frustrated with existing online tools that
                either charged premium prices for basic features, plastered watermarks on outputs,
                or worse, kept copies of uploaded files on their servers.
              </p>
              <p className="leading-relaxed">
                Our commitment is to keep all tools completely free, with no hidden fees, no premium
                tiers, and no artificial limitations. We believe everyone deserves access to quality
                tools regardless of their budget.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                What Makes Us Different
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Built with privacy and performance at the core
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Our Team
              </h2>
            </div>
            <div className="prose prose-lg dark:prose-invert mx-auto text-gray-600 dark:text-gray-300">
              <p className="leading-relaxed">
                {SITE_CONFIG.name} is built and maintained by a dedicated team of developers and
                designers who are passionate about creating useful, accessible tools for everyone.
              </p>
              <p className="leading-relaxed">
                We are a small, independent team committed to building and maintaining high-quality
                tools. Our focus is on creating software that respects users, values privacy, and
                delivers genuine value without gimmicks or dark patterns.
              </p>
              <p className="leading-relaxed">
                We continuously work on improving existing tools and adding new ones based on
                community feedback. Your suggestions and bug reports help us make {SITE_CONFIG.name} better for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Our Tools
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Explore our collection of {TOOLS.length} free tools
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700"
                >
                  <span className="text-3xl mb-2">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Have questions, suggestions, or feedback? We would love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:contact@webtools.example.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <a
                href={`https://twitter.com/${SITE_CONFIG.twitterHandle?.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow on X
              </a>
            </div>
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              For bug reports and feature requests, please open an issue on our GitHub repository.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Explore our tools and start processing your files securely.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-lg"
            >
              Browse All Tools
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
