import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { SEOHead } from '../seo/SEOHead';
import { ShareButtons } from '../components/common/ShareButtons';
import { SITE_CONFIG } from '../utils/constants';
import { getArticleBySlug, getRelatedArticles, type BlogArticle } from './blog/articles';

function ArticleContent({ content }: { content: string }) {
  // Simple markdown-like rendering for the article content
  // In a production app, you'd use a proper markdown parser like react-markdown
  const renderContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: string[] = [];
    let listKey = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
            {currentList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        flushList();
        return;
      }

      // Headers
      if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
            {trimmedLine.slice(2)}
          </h1>
        );
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
            {trimmedLine.slice(3)}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
            {trimmedLine.slice(4)}
          </h3>
        );
        return;
      }

      // List items
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        currentList.push(trimmedLine.slice(2));
        return;
      }

      // Numbered list items
      if (/^\d+\.\s/.test(trimmedLine)) {
        currentList.push(trimmedLine.replace(/^\d+\.\s/, ''));
        return;
      }

      // Code blocks (simplified)
      if (trimmedLine.startsWith('```')) {
        flushList();
        return;
      }

      // Regular paragraphs
      flushList();

      // Handle inline formatting
      let formattedLine = trimmedLine
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
        .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-sm">$1</code>');

      elements.push(
        <p
          key={index}
          className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });

    flushList();
    return elements;
  };

  return <div className="prose-lg">{renderContent(content)}</div>;
}

function RelatedArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <span>{article.category}</span>
        <span>|</span>
        <span>{article.readTime} min read</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {article.title}
      </h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
        {article.description}
      </p>
    </Link>
  );
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const article = getArticleBySlug(slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const relatedArticles = getRelatedArticles(slug);
  const articleUrl = `${SITE_CONFIG.url}/blog/${slug}`;

  return (
    <>
      <SEOHead
        title={article.title}
        description={article.description}
        keywords={article.tags}
        canonicalUrl={articleUrl}
        ogType="article"
        publishedTime={article.publishDate}
        author={article.author.name}
      />

      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-blue-200">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="text-white truncate max-w-xs">
                  {article.title.split(':')[0]}
                </li>
              </ol>
            </nav>

            {/* Article Header */}
            <div className="text-center">
              <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-4">
                {article.category}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                {article.title}
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                {article.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                    {article.author.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{article.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time dateTime={article.publishDate}>
                    {new Date(article.publishDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{article.readTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Share Buttons - Top */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Share this article
              </span>
              <ShareButtons
                url={articleUrl}
                title={article.title}
                description={article.description}
                platforms={['twitter', 'facebook', 'linkedin', 'copy']}
                variant="icons"
                size="sm"
              />
            </div>

            {/* Article Body */}
            <article className="mb-12">
              <ArticleContent content={article.content} />
            </article>

            {/* Tags */}
            <div className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Buttons - Bottom */}
            <div className="mb-12 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Found this helpful? Share it!
              </h3>
              <div className="flex justify-center">
                <ShareButtons
                  url={articleUrl}
                  title={article.title}
                  description={article.description}
                  platforms={['twitter', 'facebook', 'linkedin', 'reddit', 'email', 'copy']}
                  variant="icons"
                  size="md"
                />
              </div>
            </div>

            {/* Author Bio */}
            <div className="mb-12 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {article.author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {article.author.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {article.author.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((related) => (
                    <RelatedArticleCard key={related.slug} article={related} />
                  ))}
                </div>
              </div>
            )}

            {/* Back to Blog */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/blog"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
