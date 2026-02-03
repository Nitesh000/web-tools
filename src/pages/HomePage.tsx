import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS, BENEFITS, STATS, COMPARISON_FEATURES, SITE_CONFIG } from '../utils/constants';
import { useAppStore } from '../store/app-store';

// Tool Card Component
function ToolCard({ tool }: { tool: typeof TOOLS[0] }) {
  const { addRecentTool, favorites, toggleFavorite } = useAppStore();
  const isFavorite = favorites.includes(tool.id);

  const handleClick = () => {
    addRecentTool({ id: tool.id, name: tool.name, path: tool.path });
  };

  return (
    <Link
      to={tool.path}
      onClick={handleClick}
      className="group relative block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(tool.id);
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition-colors"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? (
          <svg className="w-5 h-5 fill-yellow-500" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )}
      </button>

      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${tool.bgColor} mb-4`}>
        <span className="text-2xl" role="img" aria-label={tool.name}>
          {tool.icon}
        </span>
      </div>

      <h3 className={`text-lg font-semibold mb-2 ${tool.color} dark:opacity-90 group-hover:underline`}>
        {tool.name}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {tool.shortDescription}
      </p>

      <div className="flex flex-wrap gap-2">
        {tool.features.slice(0, 2).map((feature) => (
          <span
            key={feature}
            className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
          >
            {feature}
          </span>
        ))}
      </div>
    </Link>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Free Online Tools
            <span className="block text-blue-200 mt-2">100% Secure & Private</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
            All {TOOLS.length} tools process your files directly in your browser.
            Nothing is ever uploaded to our servers. Your data stays on your device.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tools"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-lg"
            >
              Explore Tools
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#benefits"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
            >
              Why Choose Us
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Works offline</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% free forever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Tools Grid Section
function ToolsSection() {
  return (
    <section id="tools" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            All Tools at Your Fingertips
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose from {TOOLS.length} powerful tools - all free and privacy-focused
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Benefits Section
function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Why Choose Web Tools Suite?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Built with privacy and simplicity in mind
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-4 p-6 rounded-xl bg-gray-50 dark:bg-gray-700/50"
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {benefit.icon}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{STATS.usersCount}</div>
            <div className="mt-2 text-blue-100">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{STATS.filesProcessed}</div>
            <div className="mt-2 text-blue-100">Files Processed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{STATS.toolsAvailable}</div>
            <div className="mt-2 text-blue-100">Free Tools</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{STATS.satisfaction}</div>
            <div className="mt-2 text-blue-100">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Comparison Table Section
function ComparisonSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            How We Compare
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            See why Web Tools Suite stands out from the competition
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Feature
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Web Tools Suite
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Others
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {COMPARISON_FEATURES.map((row) => (
                <tr key={row.feature}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.us === true ? (
                      <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-300">{row.us}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.others === false ? (
                      <svg className="w-5 h-5 text-red-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">{row.others}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section (Placeholder)
function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Freelance Designer',
      content: 'Finally, tools that respect my privacy! I use the background remover daily for client work.',
      avatar: 'SM',
    },
    {
      name: 'James K.',
      role: 'Marketing Manager',
      content: 'The image compressor saved us hours of work. No more uploading to sketchy websites.',
      avatar: 'JK',
    },
    {
      name: 'Emily R.',
      role: 'Content Creator',
      content: 'Love that everything works in the browser. Super fast and no sign-up needed!',
      avatar: 'ER',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            What Users Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of happy users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "{testimonial.content}"
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// SEO Content Section
function SEOSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            About Web Tools Suite
          </h2>

          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <p>
              Web Tools Suite is a comprehensive collection of free online tools designed
              for image editing, file conversion, and everyday utility tasks. Unlike
              traditional online tools that require uploading your files to remote servers,
              our tools process everything directly in your browser using cutting-edge
              web technologies.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Privacy-First Approach
            </h3>
            <p>
              Your privacy is our top priority. All file processing happens locally on
              your device using WebAssembly and JavaScript. Your files never leave your
              computer, which means there's zero risk of data breaches or unauthorized
              access to your sensitive content.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Powerful Image Tools
            </h3>
            <p>
              Our image tools include AI-powered background removal, lossless image
              compression, format conversion between PNG, JPG, WebP, and more. Whether
              you need to resize images for social media, crop photos for your website,
              or add watermarks to protect your work, we've got you covered.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Works Offline
            </h3>
            <p>
              As a Progressive Web App (PWA), Web Tools Suite can be installed on your
              device and used offline. Perfect for situations where you need to edit
              images or convert files without an internet connection.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Free Forever
            </h3>
            <p>
              All tools are completely free to use with no hidden fees, premium tiers,
              or daily limits. We believe essential tools should be accessible to everyone,
              regardless of their budget.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer CTA Section
function FooterCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Choose a tool and start processing your files securely in seconds.
        </p>
        <a
          href="#tools"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors shadow-lg"
        >
          Browse All Tools
        </a>
      </div>
    </section>
  );
}

// Main HomePage Component
export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{SITE_CONFIG.name} - Free Online Image & File Tools</title>
        <meta name="description" content={SITE_CONFIG.description} />
        <meta property="og:title" content={SITE_CONFIG.name} />
        <meta property="og:description" content={SITE_CONFIG.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={SITE_CONFIG.url} />
      </Helmet>

      <main className="min-h-screen">
        <HeroSection />
        <ToolsSection />
        <BenefitsSection />
        <StatsSection />
        <TestimonialsSection />
        <ComparisonSection />
        <SEOSection />
        <FooterCTA />
      </main>
    </>
  );
}
