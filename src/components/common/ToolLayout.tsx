import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMeta {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedTool {
  name: string;
  href: string;
  description: string;
}

interface ToolLayoutProps {
  children: ReactNode;
  seo: SEOMeta;
  title: string;
  description: string | ReactNode;
  howToUse: string[];
  faqs?: FAQ[];
  relatedTools?: RelatedTool[];
  privacyNote?: string;
}

export function ToolLayout({
  children,
  seo,
  title,
  description,
  howToUse,
  faqs = [],
  relatedTools = [],
  privacyNote,
}: ToolLayoutProps) {
  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: seo.title,
    description: seo.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && (
          <meta name="keywords" content={seo.keywords.join(', ')} />
        )}
        {seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="website" />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        {faqJsonLd && (
          <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        )}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {title}
            </h1>
            {privacyNote && (
              <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg px-4 py-2 text-green-400 text-sm">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>{privacyNote}</span>
              </div>
            )}
          </header>

          {/* Main Tool Section */}
          <section className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 md:p-8 mb-8">
            {children}
          </section>

          {/* Description */}
          <section className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              About This Tool
            </h2>
            <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
              {typeof description === 'string' ? (
                <p className="whitespace-pre-line">{description}</p>
              ) : (
                description
              )}
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              How to Use
            </h2>
            <ol className="space-y-3">
              {howToUse.map((step, index) => (
                <li key={index} className="flex gap-4 text-slate-300">
                  <span className="flex-shrink-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ Section */}
          {faqs.length > 0 && (
            <section className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6 md:p-8 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-slate-700/30 rounded-lg border border-slate-600/30"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer text-white font-medium hover:bg-slate-700/50 rounded-lg transition-colors">
                      <span>{faq.question}</span>
                      <svg
                        className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <p className="px-4 pb-4 text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="bg-slate-800/30 rounded-xl border border-slate-700/30 p-6 md:p-8">
              <h2 className="text-xl font-semibold text-white mb-6">
                Related Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTools.map((tool, index) => (
                  <a
                    key={index}
                    href={tool.href}
                    className="block p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 hover:border-blue-500/50 transition-all group"
                  >
                    <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-400">{tool.description}</p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 mt-12 py-8">
          <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
            <p>All processing happens locally in your browser. Your files never leave your device.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default ToolLayout;
