/**
 * Dynamic Sitemap Generator for Web Tools Suite
 *
 * This script generates a sitemap.xml file based on the tools and pages
 * defined in the application. Run this as part of your build process.
 *
 * Usage:
 *   npx tsx src/utils/generate-sitemap.ts
 *
 * Or add to package.json scripts:
 *   "generate-sitemap": "tsx src/utils/generate-sitemap.ts"
 *   "build": "npm run generate-sitemap && tsc -b && vite build"
 */

import * as fs from 'fs';
import * as path from 'path';

// Site configuration
const SITE_URL = 'https://webtools.suite';
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

// Tool definitions (matching constants.ts)
interface ToolRoute {
  path: string;
  priority: number;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

// Define all routes with their SEO priorities
const toolRoutes: ToolRoute[] = [
  { path: '/background-remover', priority: 0.9, changefreq: 'monthly' },
  { path: '/image-compressor', priority: 0.9, changefreq: 'monthly' },
  { path: '/image-converter', priority: 0.9, changefreq: 'monthly' },
  { path: '/image-resizer', priority: 0.9, changefreq: 'monthly' },
  { path: '/image-cropper', priority: 0.9, changefreq: 'monthly' },
  { path: '/image-watermark', priority: 0.9, changefreq: 'monthly' },
  { path: '/color-picker', priority: 0.9, changefreq: 'monthly' },
  { path: '/qr-generator', priority: 0.9, changefreq: 'monthly' },
  { path: '/gif-maker', priority: 0.9, changefreq: 'monthly' },
  { path: '/screenshot-beautifier', priority: 0.9, changefreq: 'monthly' },
];

const staticRoutes: ToolRoute[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/blog', priority: 0.7, changefreq: 'weekly' },
];

// Blog posts (add new posts here or fetch dynamically)
const blogPosts: { path: string; lastmod: string }[] = [
  { path: '/blog/how-to-remove-image-backgrounds', lastmod: '2026-02-01' },
  { path: '/blog/image-compression-guide', lastmod: '2026-01-28' },
  { path: '/blog/qr-codes-for-business', lastmod: '2026-01-25' },
  { path: '/blog/web-image-formats-comparison', lastmod: '2026-01-20' },
];

/**
 * Get current date in YYYY-MM-DD format
 */
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Generate URL entry for sitemap
 */
function generateUrlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: number
): string {
  return `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

/**
 * Generate complete sitemap XML
 */
function generateSitemap(): string {
  const currentDate = getCurrentDate();
  const urls: string[] = [];

  // Add static routes
  for (const route of staticRoutes) {
    urls.push(generateUrlEntry(route.path, currentDate, route.changefreq, route.priority));
  }

  // Add tool routes
  for (const route of toolRoutes) {
    urls.push(generateUrlEntry(route.path, currentDate, route.changefreq, route.priority));
  }

  // Add blog posts
  for (const post of blogPosts) {
    urls.push(generateUrlEntry(post.path, post.lastmod, 'monthly', 0.6));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${urls.join('\n\n')}

</urlset>`;
}

/**
 * Generate robots.txt content
 */
function generateRobotsTxt(): string {
  return `# Web Tools Suite - Robots.txt
# ${SITE_URL}
# Generated: ${getCurrentDate()}

# Allow all crawlers
User-agent: *
Allow: /

# Disallow admin and API paths
Disallow: /admin
Disallow: /admin/
Disallow: /api
Disallow: /api/
Disallow: /_internal/
Disallow: /private/

# Disallow source maps and JSON config files
Disallow: /*.json$
Disallow: /assets/*.map$

# Crawl-delay for polite crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * Main function to generate and write sitemap files
 */
async function main(): Promise<void> {
  console.log('Generating sitemap files...\n');

  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    console.log(`Created directory: ${PUBLIC_DIR}`);
  }

  // Generate and write sitemap.xml
  const sitemapContent = generateSitemap();
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log(`Generated: ${sitemapPath}`);

  // Generate and write robots.txt
  const robotsContent = generateRobotsTxt();
  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf-8');
  console.log(`Generated: ${robotsPath}`);

  // Summary
  const totalUrls = staticRoutes.length + toolRoutes.length + blogPosts.length;
  console.log(`\nSitemap generated successfully!`);
  console.log(`- Total URLs: ${totalUrls}`);
  console.log(`- Tools: ${toolRoutes.length}`);
  console.log(`- Static pages: ${staticRoutes.length}`);
  console.log(`- Blog posts: ${blogPosts.length}`);
}

// Run if executed directly
main().catch(console.error);

// Export for programmatic use
export {
  generateSitemap,
  generateRobotsTxt,
  toolRoutes,
  staticRoutes,
  blogPosts,
  SITE_URL,
};
