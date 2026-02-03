import { type ReactNode } from 'react';
import clsx from 'clsx';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedTool {
  name: string;
  description: string;
  href: string;
}

export interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  howToUse?: ReactNode;
  seoContent?: ReactNode;
  faqItems?: FAQItem[];
  relatedTools?: RelatedTool[];
  className?: string;
}

export function ToolLayout({
  title,
  description,
  children,
  howToUse,
  seoContent,
  faqItems,
  relatedTools,
  className,
}: ToolLayoutProps) {
  return (
    <div className={clsx('min-h-[calc(100vh-4rem)]', className)}>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </header>

      {/* Main Tool Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section aria-label="Tool interface" className="mb-12">
          {children}
        </section>

        {/* How to Use Section */}
        {howToUse && (
          <section aria-labelledby="how-to-use-heading" className="mb-12">
            <h2
              id="how-to-use-heading"
              className="mb-4 text-2xl font-bold text-gray-900 dark:text-white"
            >
              How to Use
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              {howToUse}
            </div>
          </section>
        )}

        {/* SEO Content Section */}
        {seoContent && (
          <section aria-labelledby="about-heading" className="mb-12">
            <div className="prose prose-gray max-w-none dark:prose-invert">
              {seoContent}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqItems && faqItems.length > 0 && (
          <section aria-labelledby="faq-heading" className="mb-12">
            <h2
              id="faq-heading"
              className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
            >
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-900 dark:text-white">
                    {item.question}
                    <span className="ml-2 flex-shrink-0 transition-transform group-open:rotate-180">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="border-t border-gray-200 p-4 text-gray-600 dark:border-gray-700 dark:text-gray-400">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Tools Section */}
        {relatedTools && relatedTools.length > 0 && (
          <section aria-labelledby="related-tools-heading">
            <h2
              id="related-tools-heading"
              className="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
            >
              Related Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((tool, index) => (
                <a
                  key={index}
                  href={tool.href}
                  className={clsx(
                    'rounded-lg border border-gray-200 bg-white p-4',
                    'transition-all duration-200',
                    'hover:border-blue-500 hover:shadow-md',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400',
                    'dark:focus:ring-offset-gray-900'
                  )}
                >
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ToolLayout;
