/**
 * Structured Data (JSON-LD) Generators for SEO
 * Implements Schema.org vocabulary for rich search results
 */

import { siteMetaData, type ToolMetaData, type FAQItem } from './meta-data';

/**
 * WebApplication Schema
 * Used for each tool page to indicate it's a web application
 */
export interface WebApplicationSchemaOptions {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
    bestRating: number;
    worstRating: number;
  };
  screenshot?: string;
  featureList?: string[];
}

export function generateWebApplicationSchema(options: WebApplicationSchemaOptions): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: options.name,
    description: options.description,
    url: options.url,
    applicationCategory: options.applicationCategory,
    operatingSystem: options.operatingSystem || 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    permissions: 'none',
    offers: options.offers || {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: siteMetaData.siteName,
      url: siteMetaData.siteUrl,
    },
  };

  if (options.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: options.aggregateRating.ratingValue,
      ratingCount: options.aggregateRating.ratingCount,
      bestRating: options.aggregateRating.bestRating,
      worstRating: options.aggregateRating.worstRating,
    };
  }

  if (options.screenshot) {
    schema.screenshot = options.screenshot;
  }

  if (options.featureList && options.featureList.length > 0) {
    schema.featureList = options.featureList;
  }

  return schema;
}

/**
 * Generate WebApplication schema from ToolMetaData
 */
export function generateToolWebApplicationSchema(tool: ToolMetaData): object {
  return generateWebApplicationSchema({
    name: tool.title.split(' - ')[0],
    description: tool.description,
    url: `${siteMetaData.siteUrl}/tools/${tool.slug}`,
    applicationCategory: mapCategoryToSchemaCategory(tool.category),
    screenshot: `${siteMetaData.siteUrl}${tool.ogImage}`,
    featureList: tool.keywords.slice(0, 5),
  });
}

/**
 * Map internal category to Schema.org application category
 */
function mapCategoryToSchemaCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'Image Tools': 'MultimediaApplication',
    'Video Tools': 'MultimediaApplication',
    'Text Tools': 'UtilitiesApplication',
    'Developer Tools': 'DeveloperApplication',
    'Security Tools': 'SecurityApplication',
    'Design Tools': 'DesignApplication',
    'Utility Tools': 'UtilitiesApplication',
    'Business Tools': 'BusinessApplication',
  };
  return categoryMap[category] || 'WebApplication';
}

/**
 * FAQPage Schema
 * Used for FAQ sections to get rich snippets in search results
 */
export function generateFAQPageSchema(faqItems: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList Schema
 * Helps search engines understand site hierarchy
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbListSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate breadcrumb schema for a tool page
 */
export function generateToolBreadcrumbSchema(tool: ToolMetaData): object {
  return generateBreadcrumbListSchema([
    { name: 'Home', url: siteMetaData.siteUrl },
    { name: tool.category, url: `${siteMetaData.siteUrl}/category/${tool.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: tool.title.split(' - ')[0], url: `${siteMetaData.siteUrl}/tools/${tool.slug}` },
  ]);
}

/**
 * Organization Schema
 * Represents the company/entity behind the website
 */
export interface OrganizationSchemaOptions {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    contactType: string;
    email?: string;
    url?: string;
  };
}

export function generateOrganizationSchema(options: OrganizationSchemaOptions = {}): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: options.name || siteMetaData.siteName,
    url: options.url || siteMetaData.siteUrl,
    logo: options.logo || `${siteMetaData.siteUrl}/logo.png`,
    description:
      options.description ||
      'Free online tools for image editing, video conversion, and productivity. All tools work in your browser with no signup required.',
  };

  if (options.sameAs && options.sameAs.length > 0) {
    schema.sameAs = options.sameAs;
  }

  if (options.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      contactType: options.contactPoint.contactType,
      ...(options.contactPoint.email && { email: options.contactPoint.email }),
      ...(options.contactPoint.url && { url: options.contactPoint.url }),
    };
  }

  return schema;
}

/**
 * WebSite Schema with SearchAction
 * Enables sitelinks search box in Google
 */
export function generateWebSiteSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetaData.siteName,
    url: siteMetaData.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteMetaData.siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * SoftwareApplication Schema
 * Alternative to WebApplication for downloadable/installable PWAs
 */
export function generateSoftwareApplicationSchema(tool: ToolMetaData): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title.split(' - ')[0],
    description: tool.description,
    url: `${siteMetaData.siteUrl}/tools/${tool.slug}`,
    applicationCategory: mapCategoryToSchemaCategory(tool.category),
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: siteMetaData.siteName,
      url: siteMetaData.siteUrl,
    },
  };
}

/**
 * HowTo Schema
 * Useful for tool usage guides
 */
export interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[],
  totalTime?: string
): object {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
    })),
  };

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return schema;
}

/**
 * ItemList Schema
 * For tool listing pages or category pages
 */
export function generateItemListSchema(
  items: { name: string; url: string; description: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebApplication',
        name: item.name,
        url: item.url,
        description: item.description,
      },
    })),
  };
}

/**
 * Combine multiple schemas into a single array for a page
 */
export function combineSchemas(...schemas: object[]): object {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map((schema) => {
      // Remove @context from individual schemas when combining
      const { '@context': _, ...rest } = schema as Record<string, unknown>;
      return rest;
    }),
  };
}

/**
 * Generate all schemas for a tool page
 */
export function generateToolPageSchemas(tool: ToolMetaData): object {
  return combineSchemas(
    generateToolWebApplicationSchema(tool),
    generateFAQPageSchema(tool.faqItems),
    generateToolBreadcrumbSchema(tool),
    generateOrganizationSchema()
  );
}

/**
 * Serialize schema to JSON-LD script content
 */
export function schemaToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 0);
}
