/**
 * Blog Articles Data
 * SEO-optimized content for Web Tools Suite blog
 */

export interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishDate: string;
  category: string;
  readTime: number;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  featuredImage: string;
  tags: string[];
  relatedSlugs: string[];
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'how-to-remove-background-from-images',
    title: 'How to Remove Background from Images: Tips and Tricks for Perfect Results',
    description: 'Learn professional techniques for removing backgrounds from images. Discover AI-powered tools, manual methods, and expert tips for clean, transparent results.',
    publishDate: '2024-01-15',
    category: 'Image Editing',
    readTime: 8,
    author: {
      name: 'Web Tools Team',
      avatar: '/authors/team.png',
      bio: 'The Web Tools Suite team is dedicated to creating free, privacy-focused tools that work entirely in your browser.',
    },
    featuredImage: '/blog/background-removal.jpg',
    tags: ['background removal', 'image editing', 'AI tools', 'transparent PNG', 'photo editing'],
    relatedSlugs: ['best-image-formats-for-web-2024', 'understanding-qr-codes'],
    content: `
# How to Remove Background from Images: Tips and Tricks for Perfect Results

Removing backgrounds from images is one of the most common image editing tasks. Whether you're creating product photos for e-commerce, designing marketing materials, or just having fun with personal photos, knowing how to effectively remove backgrounds is an essential skill.

## Why Remove Image Backgrounds?

Background removal serves many purposes:

- **E-commerce**: Clean product images with white or transparent backgrounds convert better
- **Marketing**: Create composite images and professional graphics
- **Social Media**: Make eye-catching content that stands out
- **Personal Projects**: Remove distracting elements from photos

## Method 1: AI-Powered Background Removal (Recommended)

Modern AI tools have revolutionized background removal. Here's how to get the best results:

### Choosing the Right Tool

Look for tools that:
- Process images locally in your browser for privacy
- Support batch processing for multiple images
- Provide high-quality edge detection
- Output transparent PNG files

### Tips for AI Background Removal

1. **Use High-Resolution Images**: AI models work better with clear, detailed images
2. **Ensure Good Lighting**: Well-lit subjects are easier to separate from backgrounds
3. **Simple Backgrounds Help**: While AI can handle complex backgrounds, simple ones yield cleaner results
4. **Check the Edges**: Always zoom in to verify edge quality after removal

## Method 2: Manual Selection Tools

For more control, use manual selection methods:

### Magic Wand and Quick Selection

Best for images with clear contrast between subject and background:
- Start with a low tolerance setting
- Hold Shift to add to selection
- Use Refine Edge for better results

### Pen Tool for Precise Edges

For complex shapes or when precision matters:
- Create anchor points along the edge
- Use curves for smooth lines
- Convert path to selection when complete

## Method 3: Color Range Selection

Ideal for solid-color backgrounds:
- Sample the background color
- Adjust fuzziness for broader selection
- Invert selection to get the subject

## Best Practices for Clean Results

### Dealing with Hair and Fur

Hair is notoriously difficult to separate. Try these tips:
- Use AI tools specifically trained for hair detection
- Apply slight blur to edges if needed
- Use layer masks for manual refinement

### Handling Transparent Objects

Glass, water, and other transparent objects require special care:
- Preserve semi-transparent areas
- Consider keeping some background for context
- Use blend modes for realistic composites

### Maintaining Image Quality

To preserve quality:
- Work with the highest resolution available
- Save as PNG for transparency
- Avoid multiple re-exports

## Common Mistakes to Avoid

1. **Ignoring Edge Halos**: White or dark fringes around subjects look unprofessional
2. **Over-Processing**: Too much refinement can make edges look artificial
3. **Wrong File Format**: Saving as JPEG loses transparency
4. **Forgetting Context**: Sometimes a blurred or simplified background works better than none

## When to Use Transparent vs. White Backgrounds

### Transparent Backgrounds (PNG)

Use when:
- Placing images on colored or patterned backgrounds
- Creating overlays and composites
- Building designs with multiple layers

### White Backgrounds

Use when:
- Creating product photos for marketplaces
- Printing on white paper
- Smaller file sizes are needed

## Conclusion

Background removal has never been easier thanks to AI-powered tools. For best results, combine AI automation with manual refinement when needed. Always start with high-quality source images and pay attention to edge details for professional-looking results.

Ready to try it yourself? Use our free [Background Remover](/tools/background-remover) tool that works entirely in your browser - no uploads required, complete privacy guaranteed.
    `,
  },
  {
    slug: 'best-image-formats-for-web-2024',
    title: 'Best Image Formats for Web in 2024: Complete Guide to JPEG, PNG, WebP, and AVIF',
    description: 'Discover which image format to use for your website in 2024. Compare JPEG, PNG, WebP, AVIF, and SVG for optimal performance, quality, and browser support.',
    publishDate: '2024-01-22',
    category: 'Web Development',
    readTime: 10,
    author: {
      name: 'Web Tools Team',
      avatar: '/authors/team.png',
      bio: 'The Web Tools Suite team is dedicated to creating free, privacy-focused tools that work entirely in your browser.',
    },
    featuredImage: '/blog/image-formats.jpg',
    tags: ['image formats', 'WebP', 'AVIF', 'web performance', 'image optimization'],
    relatedSlugs: ['how-to-remove-background-from-images', 'understanding-qr-codes'],
    content: `
# Best Image Formats for Web in 2024: Complete Guide

Choosing the right image format can dramatically impact your website's loading speed, visual quality, and user experience. In 2024, we have more options than ever before. Let's explore each format and when to use them.

## Quick Comparison Table

| Format | Best For | Transparency | Animation | Compression | Browser Support |
|--------|----------|--------------|-----------|-------------|-----------------|
| JPEG | Photos | No | No | Lossy | Universal |
| PNG | Graphics, Screenshots | Yes | No | Lossless | Universal |
| WebP | All-purpose | Yes | Yes | Both | 97%+ |
| AVIF | Photos, HDR | Yes | Yes | Lossy | 92%+ |
| SVG | Icons, Logos | Yes | Yes | N/A | Universal |
| GIF | Simple Animations | Yes | Yes | Lossless | Universal |

## JPEG: The Photography Standard

JPEG (Joint Photographic Experts Group) remains the most widely used format for photographs.

### Strengths
- Universal browser support
- Excellent compression for photos
- Small file sizes
- Wide software compatibility

### Weaknesses
- No transparency support
- Lossy compression degrades quality
- Not ideal for text or sharp edges
- Each save reduces quality

### When to Use JPEG
- Photographs without transparency needs
- Social media sharing
- Email attachments
- When universal compatibility matters most

### Optimal JPEG Settings
- Quality: 75-85% for web use
- Progressive encoding for faster perceived loading
- Strip metadata to reduce file size

## PNG: Perfect for Graphics

PNG (Portable Network Graphics) excels at graphics, screenshots, and images requiring transparency.

### Strengths
- Lossless compression
- Full transparency support (alpha channel)
- Sharp edges and text preservation
- No quality loss on repeated saves

### Weaknesses
- Larger file sizes than JPEG for photos
- No animation support
- Can be significantly larger than WebP

### When to Use PNG
- Logos and icons with transparency
- Screenshots with text
- Graphics with sharp edges
- Images requiring exact color reproduction

### PNG Optimization Tips
- Use PNG-8 for simple graphics (256 colors)
- PNG-24 for complex images with transparency
- Always compress before uploading

## WebP: The Modern All-Rounder

WebP, developed by Google, offers the best of both worlds with excellent compression and feature support.

### Strengths
- 25-35% smaller than JPEG at similar quality
- Supports both lossy and lossless compression
- Transparency support
- Animation support
- Excellent browser support (97%+)

### Weaknesses
- Slightly more CPU-intensive to decode
- Some older tools don't support it
- Safari support only since macOS Big Sur

### When to Use WebP
- Primary format for web images in 2024
- Replace both JPEG and PNG where supported
- Animated content (instead of GIF)
- Modern web applications

### WebP Quality Settings
- Lossy: 75-85 quality for photos
- Lossless: For graphics and screenshots
- Use with fallback for older browsers

## AVIF: The Future of Web Images

AVIF (AV1 Image File Format) offers superior compression based on the AV1 video codec.

### Strengths
- 50% smaller than JPEG at similar quality
- Excellent for HDR and wide color gamut
- Supports transparency and animation
- Better compression than WebP

### Weaknesses
- Slower encoding times
- Higher CPU usage for decoding
- Browser support still growing (92%+)
- Limited tool support

### When to Use AVIF
- Hero images and large photos
- When maximum compression matters
- HDR content
- Progressive web apps

### AVIF Considerations
- Use with WebP and JPEG fallbacks
- Quality 60-70 often sufficient
- Consider encoding time for dynamic content

## SVG: Scalable Vector Graphics

SVG is perfect for resolution-independent graphics that scale perfectly at any size.

### Strengths
- Infinitely scalable
- Tiny file sizes for simple graphics
- Can be styled with CSS
- Animatable with CSS/JavaScript
- Accessible and searchable text

### Weaknesses
- Not suitable for photographs
- Complex graphics can be large
- Potential security concerns (embedded scripts)

### When to Use SVG
- Logos and brand marks
- Icons and illustrations
- Interactive graphics
- Responsive design elements

## GIF: Limited But Still Useful

GIF remains relevant for simple animations despite limitations.

### Strengths
- Universal support
- Simple animation
- Wide compatibility

### Weaknesses
- 256 color limit
- Large file sizes
- Poor quality for photos
- No partial transparency

### When to Use GIF
- Simple animated content
- When universal support is critical
- Memes and reactions (cultural reasons)

## Format Selection Flowchart

1. **Is it a vector graphic or icon?** → Use SVG
2. **Does it need animation?** → Use WebP (or AVIF with fallback)
3. **Does it need transparency?** → Use WebP or PNG
4. **Is it a photograph?** → Use WebP (with JPEG fallback) or AVIF
5. **Need universal compatibility?** → Use JPEG or PNG

## Implementation Best Practices

### Use the Picture Element

\`\`\`html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
\`\`\`

### Responsive Images

\`\`\`html
<img
  srcset="image-400.webp 400w,
          image-800.webp 800w,
          image-1200.webp 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  src="image-800.webp"
  alt="Description"
>
\`\`\`

## Conclusion

In 2024, WebP should be your default format for most web images, with AVIF for high-priority images where maximum compression matters. Always provide fallbacks for broader compatibility.

Use our free [Image Format Converter](/tools/image-format-converter) to convert your images between formats, and our [Image Compressor](/tools/image-compressor) to optimize file sizes - all processed locally in your browser for complete privacy.
    `,
  },
  {
    slug: 'password-security-best-practices',
    title: 'Password Security Best Practices: How to Create and Manage Strong Passwords in 2024',
    description: 'Learn essential password security practices for 2024. Discover how to create unbreakable passwords, use password managers effectively, and protect your online accounts.',
    publishDate: '2024-02-05',
    category: 'Security',
    readTime: 12,
    author: {
      name: 'Web Tools Team',
      avatar: '/authors/team.png',
      bio: 'The Web Tools Suite team is dedicated to creating free, privacy-focused tools that work entirely in your browser.',
    },
    featuredImage: '/blog/password-security.jpg',
    tags: ['password security', 'cybersecurity', 'password manager', 'online safety', '2FA'],
    relatedSlugs: ['understanding-qr-codes', 'best-image-formats-for-web-2024'],
    content: `
# Password Security Best Practices: How to Create and Manage Strong Passwords in 2024

In an era of increasingly sophisticated cyber attacks, password security has never been more important. This comprehensive guide covers everything you need to know about creating, managing, and protecting your passwords.

## The State of Password Security in 2024

Recent statistics paint a concerning picture:

- **81%** of data breaches involve weak or stolen passwords
- The average person has **100+** online accounts
- **65%** of people reuse passwords across multiple sites
- **23 million** accounts still use "123456" as their password

## What Makes a Password Strong?

A strong password has these characteristics:

### Length Over Complexity

Modern security research shows that **length is more important than complexity**:

- **Minimum 12 characters** for important accounts
- **16+ characters** for critical accounts (banking, email)
- **20+ characters** for master passwords

### Character Variety

Include a mix of:
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (!@#$%^&*)

### Unpredictability

Avoid:
- Dictionary words
- Personal information (names, birthdays)
- Common patterns (qwerty, 12345)
- Simple substitutions (p@ssw0rd)

## Password Creation Methods

### Method 1: Random Generation (Recommended)

Using a cryptographically secure random generator is the most secure method:

**Example**: \`K#9mP$vQ2xL@nW5j\`

Benefits:
- Maximum entropy (randomness)
- No personal bias
- Impossible to guess

Use our [Password Generator](/tools/password-generator) to create truly random, secure passwords.

### Method 2: Passphrase Method

Create memorable phrases that are still secure:

**Example**: \`Correct-Horse-Battery-Staple-42!\`

Tips for strong passphrases:
- Use 4-6 random words
- Add numbers and symbols
- Avoid famous quotes or song lyrics
- Include deliberate misspellings

### Method 3: Sentence Method

Transform a sentence into a password:

**Sentence**: "I graduated from MIT in 2015 with honors!"
**Password**: \`IgfMi2015wh!\`

## Password Management Strategies

### Use a Password Manager

Password managers are essential tools that:
- Generate strong, unique passwords
- Store passwords securely encrypted
- Auto-fill login forms
- Sync across devices
- Alert you to breaches

### Popular Password Managers

| Manager | Free Tier | Key Features |
|---------|-----------|--------------|
| Bitwarden | Yes | Open source, self-host option |
| 1Password | Trial only | Family sharing, travel mode |
| Dashlane | Limited | VPN included, dark web monitoring |
| KeePass | Yes | Local storage, fully offline |

### Master Password Best Practices

Your master password protects all other passwords:

1. Make it **20+ characters**
2. Use the passphrase method
3. **Never** use it anywhere else
4. Consider adding a physical element (Yubikey)

## Multi-Factor Authentication (MFA)

Always enable MFA when available:

### Types of MFA (Ranked by Security)

1. **Hardware Keys** (Best) - YubiKey, Titan Key
2. **Authenticator Apps** (Great) - Authy, Google Authenticator
3. **SMS Codes** (Acceptable) - Better than nothing
4. **Email Codes** (Weakest) - Only if no other option

### Setting Up MFA

Priority accounts for MFA:
- Email (it's the key to everything else)
- Banking and financial
- Social media
- Cloud storage
- Work accounts

## What NOT to Do

### Common Password Mistakes

1. **Password Reuse**: One breach compromises all accounts
2. **Simple Variations**: Adding "1" or "!" doesn't help much
3. **Storing in Plain Text**: Sticky notes, unencrypted files
4. **Sharing Passwords**: Even with trusted people
5. **Using Public Computers**: Keyloggers may be present

### Password Patterns to Avoid

- \`Summer2024!\` (Season + Year + Symbol)
- \`CompanyName123\` (Obvious work passwords)
- \`YourName1990\` (Name + Birth year)
- \`Password1!\` (Never, ever)

## Checking If You've Been Breached

### Use Breach Monitoring Services

- [Have I Been Pwned](https://haveibeenpwned.com) - Free breach checking
- Password manager breach alerts
- Credit monitoring services

### What to Do If Breached

1. **Change the compromised password immediately**
2. **Change passwords on any site using the same password**
3. **Enable MFA** if not already active
4. **Monitor accounts** for suspicious activity
5. **Consider credit freeze** for financial breaches

## Password Security for Teams

### Business Best Practices

- Implement password policies (minimum requirements)
- Use enterprise password managers
- Require MFA for all employees
- Regular security training
- Audit password practices

### Sharing Passwords Securely

When password sharing is necessary:
- Use password manager sharing features
- Set expiration on shared access
- Use least-privilege principle
- Audit shared credentials regularly

## The Future of Passwords

### Passwordless Authentication

Emerging technologies are moving toward:
- **Passkeys** - Biometric or device-based authentication
- **WebAuthn** - Browser-based authentication standard
- **Zero-knowledge proofs** - Prove identity without revealing secrets

### What You Can Do Now

1. Start using a password manager today
2. Enable MFA on all important accounts
3. Support services implementing passkeys
4. Stay informed about security developments

## Quick Reference Checklist

- [ ] All passwords are unique
- [ ] Passwords are 12+ characters
- [ ] Using a password manager
- [ ] MFA enabled on critical accounts
- [ ] Regular breach monitoring
- [ ] No passwords written down or in plain text
- [ ] Secure recovery options set up

## Conclusion

Password security doesn't have to be complicated. By using a password manager, enabling MFA, and following the practices outlined in this guide, you can dramatically reduce your risk of account compromise.

Start by generating strong, unique passwords with our free [Password Generator](/tools/password-generator) - it creates cryptographically secure passwords right in your browser, with nothing stored or transmitted anywhere.

Stay safe online!
    `,
  },
  {
    slug: 'understanding-qr-codes',
    title: 'Understanding QR Codes: How They Work, Types, and Creative Uses in 2024',
    description: 'Learn everything about QR codes - how they work, different types, best practices for creation, and innovative uses. Complete guide with practical examples.',
    publishDate: '2024-02-12',
    category: 'Technology',
    readTime: 9,
    author: {
      name: 'Web Tools Team',
      avatar: '/authors/team.png',
      bio: 'The Web Tools Suite team is dedicated to creating free, privacy-focused tools that work entirely in your browser.',
    },
    featuredImage: '/blog/qr-codes.jpg',
    tags: ['QR codes', 'technology', 'marketing', 'mobile', 'contactless'],
    relatedSlugs: ['password-security-best-practices', 'how-to-remove-background-from-images'],
    content: `
# Understanding QR Codes: How They Work, Types, and Creative Uses in 2024

QR codes have become an integral part of modern life, from restaurant menus to payment systems. This guide explores everything you need to know about QR codes, their technology, and how to use them effectively.

## What is a QR Code?

QR stands for "Quick Response." Invented in 1994 by Denso Wave for tracking automotive parts, QR codes have evolved into a versatile tool for connecting physical and digital worlds.

### Anatomy of a QR Code

A QR code consists of several key components:

- **Finder Patterns**: The three large squares in corners for orientation
- **Alignment Pattern**: Smaller square for distortion correction
- **Timing Patterns**: Alternating modules defining coordinates
- **Format Information**: Error correction level and mask pattern
- **Data Area**: The encoded information
- **Quiet Zone**: White border around the code

## How QR Codes Work

### Data Encoding Process

1. **Input data** is converted to binary
2. **Error correction** codes are added
3. Data is arranged in a **matrix pattern**
4. **Masking** is applied for optimal scanning
5. **Format and version info** is added

### Scanning Process

1. Camera captures the QR code image
2. Software identifies finder patterns
3. Orientation and size are determined
4. Data matrix is read and decoded
5. Error correction restores any damaged data
6. Final data is extracted and processed

## Types of QR Codes

### Static QR Codes

Information is encoded directly:
- Content cannot be changed after creation
- Works forever (no dependency on servers)
- Ideal for permanent information

**Use Cases**:
- Product serial numbers
- WiFi network credentials
- Permanent contact information
- Fixed URLs

### Dynamic QR Codes

Point to a redirect URL:
- Content can be updated anytime
- Requires active redirect service
- Provides scan analytics

**Use Cases**:
- Marketing campaigns
- Time-sensitive content
- A/B testing
- Tracking engagement

## Data Types QR Codes Can Store

### URL
The most common use - linking to websites:
\`\`\`
https://example.com/page
\`\`\`

### Plain Text
Any text up to approximately 4,000 characters:
\`\`\`
Hello, this is a message stored in a QR code!
\`\`\`

### WiFi Network
Connect devices to WiFi instantly:
\`\`\`
WIFI:T:WPA;S:NetworkName;P:Password;;
\`\`\`

### Contact Information (vCard)
Share complete contact details:
\`\`\`
BEGIN:VCARD
VERSION:3.0
N:Smith;John
TEL:+1234567890
EMAIL:john@example.com
END:VCARD
\`\`\`

### Email
Pre-compose an email:
\`\`\`
mailto:email@example.com?subject=Hello&body=Message
\`\`\`

### SMS
Pre-compose a text message:
\`\`\`
smsto:+1234567890:Hello from QR code!
\`\`\`

### Geolocation
Share a map location:
\`\`\`
geo:40.7128,-74.0060
\`\`\`

### Calendar Event
Add events to calendar:
\`\`\`
BEGIN:VEVENT
SUMMARY:Meeting
DTSTART:20240301T100000
DTEND:20240301T110000
END:VEVENT
\`\`\`

## Error Correction Levels

QR codes can still work when partially damaged:

| Level | Recovery Capacity | Best For |
|-------|-------------------|----------|
| L (Low) | ~7% | Clean environments |
| M (Medium) | ~15% | General use |
| Q (Quartile) | ~25% | Industrial settings |
| H (High) | ~30% | Adding logos |

### Choosing Error Correction

- **Level L**: Maximum data capacity, minimal damage resistance
- **Level M**: Balanced approach (recommended for most uses)
- **Level Q**: Good for printed materials
- **Level H**: Required when adding logos or decorations

## QR Code Best Practices

### Design Guidelines

1. **Maintain Contrast**: Dark modules on light background
2. **Keep Quiet Zone**: Minimum 4 modules of white space
3. **Appropriate Size**: Minimum 2cm x 2cm for print
4. **Test Before Printing**: Scan with multiple devices

### Adding Logos and Branding

With high error correction (H level):
- Logo can cover up to 30% of code
- Center placement works best
- Maintain contrast around logo
- Always test scannability

### Color Considerations

- Dark foreground, light background (not reversed)
- Sufficient contrast (at least 40% difference)
- Avoid gradients in data area
- Test with multiple devices

## Creative QR Code Uses

### Marketing and Advertising

- Product packaging links to tutorials
- Billboard campaigns with instant engagement
- Print ads connected to landing pages
- Business cards with portfolio links

### Contactless Solutions

- Restaurant menus
- Payment systems
- Event check-ins
- Digital receipts

### Education

- Interactive textbooks
- Museum exhibit information
- Assignment submissions
- Resource sharing

### Personal Use

- WiFi sharing with guests
- Pet collar ID tags
- Luggage identification
- Gift scavenger hunts

## QR Code Security

### Potential Risks

- **Malicious URLs**: Links to phishing or malware sites
- **Hidden Redirects**: Codes that change destination
- **Social Engineering**: Covering legitimate codes with malicious ones

### Safety Tips

1. **Check URL before visiting**: Most phone cameras show the URL
2. **Be cautious of unexpected codes**: Random stickers in public places
3. **Use security software**: Mobile antivirus can help
4. **Verify payment QR codes**: Especially in retail environments

## QR Code vs Barcode

| Feature | QR Code | Barcode |
|---------|---------|---------|
| Data Capacity | ~4,000 characters | ~20 characters |
| Dimensions | 2D | 1D |
| Scan Angle | Any direction | Horizontal only |
| Error Correction | Yes | No |
| Size Efficiency | Higher | Lower |

## Measuring QR Code Success

Track these metrics:
- **Scan count**: Total number of scans
- **Unique scans**: Individual users
- **Location**: Where scans occur
- **Time**: When people scan
- **Device**: iOS vs Android
- **Conversion**: Actions after scanning

## Future of QR Codes

### Emerging Trends

- **Invisible QR codes**: Embedded in images
- **Animated QR codes**: Dynamic visual codes
- **AR integration**: Trigger augmented reality experiences
- **Blockchain verification**: Authentic product verification

## Creating Your Own QR Codes

When creating QR codes, consider:
1. What action do you want users to take?
2. How will the code be displayed?
3. What's the minimum scan distance?
4. Do you need tracking capabilities?
5. What error correction level is appropriate?

Use our free [QR Code Generator](/tools/qr-code-generator) to create custom QR codes with your choice of colors, error correction levels, and data types - all processed locally in your browser for complete privacy.

## Conclusion

QR codes are a powerful bridge between physical and digital experiences. By understanding how they work and following best practices, you can create effective QR codes for any purpose.

Whether you're using them for business, education, or personal projects, the key is making them easy to scan, providing clear value to users, and ensuring the linked content delivers on its promise.
    `,
  },
];

/**
 * Get all articles
 */
export function getAllArticles(): BlogArticle[] {
  return blogArticles.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.slug === slug);
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): BlogArticle[] {
  return blogArticles.filter((article) => article.category === category);
}

/**
 * Get related articles
 */
export function getRelatedArticles(slug: string): BlogArticle[] {
  const article = getArticleBySlug(slug);
  if (!article) return [];

  return article.relatedSlugs
    .map((relatedSlug) => getArticleBySlug(relatedSlug))
    .filter((a): a is BlogArticle => a !== undefined);
}

/**
 * Get all categories with counts
 */
export function getAllCategories(): { name: string; count: number }[] {
  const categoryMap = new Map<string, number>();

  blogArticles.forEach((article) => {
    const count = categoryMap.get(article.category) || 0;
    categoryMap.set(article.category, count + 1);
  });

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));
}

/**
 * Get all tags with counts
 */
export function getAllTags(): { name: string; count: number }[] {
  const tagMap = new Map<string, number>();

  blogArticles.forEach((article) => {
    article.tags.forEach((tag) => {
      const count = tagMap.get(tag) || 0;
      tagMap.set(tag, count + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
