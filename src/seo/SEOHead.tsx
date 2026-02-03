/**
 * SEOHead Component
 * Comprehensive SEO component using react-helmet-async
 * Renders all meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
 */

import { Helmet } from 'react-helmet-async';
import { siteMetaData, type ToolMetaData, type FAQItem } from './meta-data';
import {
  generateToolPageSchemas,
  generateFAQPageSchema,
  generateBreadcrumbListSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  schemaToJsonLd,
  combineSchemas,
  type BreadcrumbItem,
} from './structured-data';

export interface SEOHeadProps {
  /**
   * Page title - will be formatted as "{title} | {siteName}"
   */
  title: string;
  /**
   * Meta description (150-160 characters recommended)
   */
  description: string;
  /**
   * Keywords for meta keywords tag
   */
  keywords?: string[];
  /**
   * Canonical URL for the page
   */
  canonicalUrl?: string;
  /**
   * Open Graph image URL
   */
  ogImage?: string;
  /**
   * Open Graph type (default: website)
   */
  ogType?: 'website' | 'article' | 'product';
  /**
   * Twitter card type (default: summary_large_image)
   */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  /**
   * Structured data schemas to inject
   */
  structuredData?: object | object[];
  /**
   * FAQ items for FAQ schema
   */
  faqItems?: FAQItem[];
  /**
   * Breadcrumb items for breadcrumb schema
   */
  breadcrumbs?: BreadcrumbItem[];
  /**
   * Disable indexing for this page
   */
  noIndex?: boolean;
  /**
   * Disable following links on this page
   */
  noFollow?: boolean;
  /**
   * Article published time (for article og:type)
   */
  publishedTime?: string;
  /**
   * Article modified time (for article og:type)
   */
  modifiedTime?: string;
  /**
   * Article author (for article og:type)
   */
  author?: string;
  /**
   * Additional meta tags
   */
  additionalMeta?: Array<{ name?: string; property?: string; content: string }>;
  /**
   * Additional link tags
   */
  additionalLinks?: Array<{ rel: string; href: string; hrefLang?: string }>;
}

/**
 * SEOHead - Comprehensive SEO component
 */
export function SEOHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  faqItems,
  breadcrumbs,
  noIndex = false,
  noFollow = false,
  publishedTime,
  modifiedTime,
  author,
  additionalMeta = [],
  additionalLinks = [],
}: SEOHeadProps) {
  const fullTitle = `${title} | ${siteMetaData.siteName}`;
  const fullOgImage = ogImage
    ? ogImage.startsWith('http')
      ? ogImage
      : `${siteMetaData.siteUrl}${ogImage}`
    : `${siteMetaData.siteUrl}${siteMetaData.defaultOgImage}`;
  const fullCanonicalUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Build robots directive
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow',
    'max-snippet:-1',
    'max-image-preview:large',
    'max-video-preview:-1',
  ].join(', ');

  // Collect all structured data schemas
  const schemas: object[] = [];

  if (structuredData) {
    if (Array.isArray(structuredData)) {
      schemas.push(...structuredData);
    } else {
      schemas.push(structuredData);
    }
  }

  if (faqItems && faqItems.length > 0) {
    schemas.push(generateFAQPageSchema(faqItems));
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbListSchema(breadcrumbs));
  }

  // Always include organization schema on main pages
  schemas.push(generateOrganizationSchema());

  const combinedSchema = schemas.length > 1 ? combineSchemas(...schemas) : schemas[0];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteMetaData.siteName} />
      <meta property="og:locale" content={siteMetaData.locale} />

      {/* Article specific Open Graph tags */}
      {ogType === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {ogType === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {ogType === 'article' && author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />
      {siteMetaData.twitterHandle && (
        <meta name="twitter:site" content={siteMetaData.twitterHandle} />
      )}
      {siteMetaData.twitterHandle && (
        <meta name="twitter:creator" content={siteMetaData.twitterHandle} />
      )}

      {/* Theme and App Meta */}
      <meta name="theme-color" content={siteMetaData.themeColor} />
      <meta name="msapplication-TileColor" content={siteMetaData.themeColor} />
      <meta name="application-name" content={siteMetaData.siteName} />
      <meta name="apple-mobile-web-app-title" content={siteMetaData.siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Additional Meta Tags */}
      {additionalMeta.map((meta, index) => (
        <meta
          key={`additional-meta-${index}`}
          {...(meta.name ? { name: meta.name } : { property: meta.property })}
          content={meta.content}
        />
      ))}

      {/* Additional Link Tags */}
      {additionalLinks.map((link, index) => (
        <link
          key={`additional-link-${index}`}
          rel={link.rel}
          href={link.href}
          {...(link.hrefLang ? { hrefLang: link.hrefLang } : {})}
        />
      ))}

      {/* JSON-LD Structured Data */}
      {combinedSchema && (
        <script type="application/ld+json">{schemaToJsonLd(combinedSchema)}</script>
      )}
    </Helmet>
  );
}

/**
 * SEOHead component specifically optimized for tool pages
 */
export interface ToolSEOHeadProps {
  tool: ToolMetaData;
  canonicalUrl?: string;
  additionalStructuredData?: object[];
}

export function ToolSEOHead({ tool, canonicalUrl, additionalStructuredData = [] }: ToolSEOHeadProps) {
  const toolSchemas = generateToolPageSchemas(tool);

  return (
    <SEOHead
      title={tool.title}
      description={tool.description}
      keywords={tool.keywords}
      canonicalUrl={canonicalUrl || `${siteMetaData.siteUrl}/tools/${tool.slug}`}
      ogImage={tool.ogImage}
      ogType="website"
      structuredData={[toolSchemas, ...additionalStructuredData]}
      breadcrumbs={[
        { name: 'Home', url: siteMetaData.siteUrl },
        {
          name: tool.category,
          url: `${siteMetaData.siteUrl}/category/${tool.category.toLowerCase().replace(/\s+/g, '-')}`,
        },
        { name: tool.title.split(' - ')[0], url: `${siteMetaData.siteUrl}/tools/${tool.slug}` },
      ]}
    />
  );
}

/**
 * SEOHead component for the home page
 */
export interface HomeSEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
}

export function HomeSEOHead({
  title = 'Web Tools Suite - Free Online Tools for Images, Videos, PDFs & More',
  description = 'Free online tools for image editing, video conversion, PDF manipulation, and more. No signup required. Fast, secure, and works entirely in your browser.',
  keywords = [
    'online tools',
    'free tools',
    'web tools',
    'image tools',
    'video tools',
    'pdf tools',
    'developer tools',
  ],
}: HomeSEOHeadProps) {
  const homeSchemas = combineSchemas(generateWebSiteSchema(), generateOrganizationSchema());

  return (
    <SEOHead
      title={title}
      description={description}
      keywords={keywords}
      canonicalUrl={siteMetaData.siteUrl}
      ogImage={siteMetaData.defaultOgImage}
      structuredData={homeSchemas}
      breadcrumbs={[{ name: 'Home', url: siteMetaData.siteUrl }]}
    />
  );
}

/**
 * SEOHead component for category pages
 */
export interface CategorySEOHeadProps {
  categoryName: string;
  categorySlug: string;
  description: string;
  tools: ToolMetaData[];
}

export function CategorySEOHead({
  categoryName,
  categorySlug,
  description,
  tools,
}: CategorySEOHeadProps) {
  const categoryUrl = `${siteMetaData.siteUrl}/category/${categorySlug}`;

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: categoryName,
    description: description,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebApplication',
        name: tool.title.split(' - ')[0],
        url: `${siteMetaData.siteUrl}/tools/${tool.slug}`,
        description: tool.description,
      },
    })),
  };

  return (
    <SEOHead
      title={`${categoryName} - Free Online ${categoryName}`}
      description={description}
      keywords={[categoryName.toLowerCase(), 'free tools', 'online tools']}
      canonicalUrl={categoryUrl}
      structuredData={itemListSchema}
      breadcrumbs={[
        { name: 'Home', url: siteMetaData.siteUrl },
        { name: categoryName, url: categoryUrl },
      ]}
    />
  );
}

export default SEOHead;
