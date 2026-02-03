import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS, SITE_CONFIG } from '../utils/constants';

export default function NotFound() {
  // Show a few popular tools as suggestions
  const popularTools = TOOLS.slice(0, 4);

  return (
    <>
      <Helmet>
        <title>Page Not Found - {SITE_CONFIG.name}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-gray-200 dark:text-gray-700">
              404
            </div>
            <div className="relative -mt-16">
              <svg
                className="w-32 h-32 mx-auto text-blue-500 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            The page you're looking for doesn't exist or has been moved.
            Don't worry, you can find plenty of other useful tools below!
          </p>

          {/* Primary action */}
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg mb-12"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go to Homepage
          </Link>

          {/* Quick links to tools */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Popular Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group"
                >
                  <span className="text-2xl block mb-2">{tool.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search suggestion */}
          <div className="mt-12 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Looking for something specific?
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Try browsing our{' '}
              <Link
                to="/#tools"
                className="underline hover:text-blue-900 dark:hover:text-blue-100"
              >
                complete list of tools
              </Link>{' '}
              or check the URL for typos.
            </p>
          </div>

          {/* Help links */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Home
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link
              to="/#tools"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              All Tools
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="mailto:support@webtools.example.com"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
