import { Link } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';
import { SITE_CONFIG } from '../utils/constants';
import { getAllArticles, getAllCategories, type BlogArticle } from './blog/articles';

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <article className="group flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Featured Image */}
      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-50">
            {article.category === 'Image Editing' && '🖼️'}
            {article.category === 'Web Development' && '🌐'}
            {article.category === 'Security' && '🔒'}
            {article.category === 'Technology' && '💻'}
          </span>
        </div>
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300">
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <time dateTime={article.publishDate}>
            {new Date(article.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {article.readTime} min read
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link to={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
          {article.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read More */}
        <Link
          to={`/blog/${article.slug}`}
          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          Read Article
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

function CategoryFilter({ categories }: { categories: { name: string; count: number }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium text-sm">
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.name}
          className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {category.name} ({category.count})
        </button>
      ))}
    </div>
  );
}

export default function BlogPage() {
  const articles = getAllArticles();
  const categories = getAllCategories();

  return (
    <>
      <SEOHead
        title="Blog"
        description="Tips, tutorials, and guides for image editing, web development, security, and more. Learn how to get the most out of our free online tools."
        keywords={['blog', 'tutorials', 'guides', 'tips', 'image editing', 'web development']}
        canonicalUrl={`${SITE_CONFIG.url}/blog`}
      />

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Blog & Tutorials
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
                Tips, guides, and tutorials to help you make the most of our tools and improve your skills.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="mb-12">
              <CategoryFilter categories={categories} />
            </div>

            {/* Articles Grid */}
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Articles Yet
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We are working on creating helpful content. Check back soon!
                </p>
              </div>
            )}

            {/* Newsletter Section */}
            <div className="mt-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 p-8 md:p-12">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Stay Updated
                </h2>
                <p className="text-blue-100 mb-6">
                  Get notified when we publish new articles and tutorials. No spam, unsubscribe anytime.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </section>
      </main>
    </>
  );
}
