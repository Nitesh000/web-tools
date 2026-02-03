import { ToolLayout } from '../components/common/ToolLayout';
import { InvoiceGenerator } from '../components/tools/invoice-generator/InvoiceGenerator';

const seoMeta = {
  title: 'Invoice Generator - Free Online Professional Invoice Maker | Web Tools Suite',
  description:
    'Create professional invoices for free with our online invoice generator. Add your logo, customize templates, calculate taxes automatically, and download as PDF. No signup or account required.',
  keywords: [
    'invoice generator',
    'free invoice maker',
    'online invoice creator',
    'professional invoice',
    'invoice template',
    'create invoice online',
    'invoice pdf',
    'business invoice',
    'freelance invoice',
    'invoice with logo',
    'tax invoice',
    'invoice calculator',
    'billing software',
    'receipt generator',
    'estimate generator',
    'quotation maker',
    'small business invoice',
    'contractor invoice',
  ],
  canonicalUrl: 'https://webtools.dev/invoice-generator',
};

const howToUseSteps = [
  'Select your preferred template style (Modern, Classic, or Minimal) and currency from the dropdown menus at the top.',
  'Fill in your company information including name, address, and optionally upload your company logo for branding.',
  'Enter your client details: their name, address, and email address.',
  'Customize the invoice number and prefix, or use the regenerate button to create a new unique invoice number.',
  'Set the invoice date and due date. The due date defaults to 30 days from today.',
  'Add line items with descriptions, quantities, and unit prices. Click "+ Add Line Item" to add more items as needed.',
  'Set your tax rate (percentage) and any discount amount. The totals will calculate automatically.',
  'Add optional notes for payment terms and include your payment details (bank account, PayPal, etc.).',
  'Preview your invoice in real-time on the right panel. Click "Preview Invoice" on mobile to see the full preview.',
  'Click "Download PDF" to save your invoice. The tool uses browser print functionality to create a clean PDF.',
];

const faqs = [
  {
    question: 'Is this invoice generator really free?',
    answer:
      'Yes, our invoice generator is completely free with no hidden fees, no watermarks, and no limits on the number of invoices you can create. There is no signup or account required. Simply fill in your details and download your professional invoice as a PDF.',
  },
  {
    question: 'Can I add my company logo to the invoice?',
    answer:
      'Absolutely! Click the "Upload Logo" button in the company information section to add your logo. It will appear prominently on your invoice. You can remove or change the logo at any time. The logo is stored locally in your browser along with your draft.',
  },
  {
    question: 'What template styles are available?',
    answer:
      'We offer three professional template styles: Modern (blue gradient header with clean design), Classic (traditional black and white with serif fonts), and Minimal (clean, understated design with subtle styling). All templates look professional and print beautifully.',
  },
  {
    question: 'What currencies are supported?',
    answer:
      'We support 10 major currencies including US Dollar (USD), Euro (EUR), British Pound (GBP), Japanese Yen (JPY), Canadian Dollar (CAD), Australian Dollar (AUD), Swiss Franc (CHF), Chinese Yuan (CNY), Indian Rupee (INR), and Brazilian Real (BRL). The correct currency symbol is used throughout your invoice.',
  },
  {
    question: 'How does the tax calculation work?',
    answer:
      'Enter your tax rate as a percentage (e.g., 20 for 20% VAT). The tool automatically calculates tax based on your subtotal and displays it separately. You can also add a flat discount amount that is subtracted from the total. Multiple tax rates are not currently supported.',
  },
  {
    question: 'Is my invoice data saved?',
    answer:
      'Your invoice data is automatically saved as a draft in your browser local storage. This means you can close the browser and return later to continue editing. However, this data is only stored on your device and is not synced across browsers or devices. Click "Clear Draft" to start fresh.',
  },
  {
    question: 'How do I download the invoice as PDF?',
    answer:
      'Click the "Download PDF" button to open your browser print dialog. Select "Save as PDF" as the destination (this option varies by browser). The invoice is specially formatted for printing with proper page sizing and clean styling.',
  },
  {
    question: 'Can I edit the invoice number format?',
    answer:
      'Yes, you can customize both the prefix and the unique identifier. The prefix field lets you set a custom prefix like "INV-" or "2024-". The invoice number itself can be manually edited, or you can click the regenerate button to create a new unique number using the current prefix.',
  },
];

const relatedTools = [
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Create QR codes for payment links',
  },
  {
    name: 'PDF Tools',
    href: '/pdf-tools',
    description: 'Merge, split, and compress PDF files',
  },
  {
    name: 'Password Generator',
    href: '/password-generator',
    description: 'Generate secure passwords for accounts',
  },
  {
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format and validate JSON data',
  },
  {
    name: 'Text Case Converter',
    href: '/text-case-converter',
    description: 'Convert text between different cases',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Pick colors for your brand materials',
  },
];

const seoDescription = `
Professional invoicing is essential for any business, freelancer, or contractor. An invoice is not just a request for payment - it is a legal document that establishes the terms of your transaction, provides a record for accounting, and reflects your professional image. Our free online invoice generator makes creating polished, professional invoices simple and fast.

Why Use an Invoice Generator?

Creating invoices manually in word processors or spreadsheets is time-consuming and error-prone. You need to format everything correctly, ensure calculations are accurate, and maintain consistency across invoices. An invoice generator handles all of this automatically, letting you focus on your actual work rather than administrative tasks.

Professional Templates for Every Business

First impressions matter, and your invoice is often the last touchpoint with a client for a particular project. We offer three carefully designed templates that project professionalism. The Modern template features a bold blue gradient header and clean sans-serif typography, perfect for tech companies, creative agencies, and modern businesses. The Classic template uses traditional styling with a serif font and formal layout, ideal for legal services, consulting firms, and established businesses. The Minimal template offers a clean, understated design that lets your content speak for itself, great for designers, photographers, and minimalist brands.

Complete Customization Options

Every business is different, and your invoices should reflect your unique brand. Upload your company logo to appear prominently on every invoice. Choose from multiple currency options with proper symbol formatting. Set custom invoice number prefixes to match your numbering system. Add detailed notes about payment terms, thank-you messages, or project-specific information.

Automatic Calculations

Manual calculations lead to errors that can be embarrassing or even cost you money. Our generator automatically calculates line item totals by multiplying quantity and unit price, subtotals summing all line items, tax amounts based on your specified percentage, discount deductions from your total, and final amounts due. Add as many line items as you need, adjust quantities and prices, and watch the totals update in real-time.

Multi-Currency Support

Whether you work locally or internationally, we support the currencies you need: US Dollar, Euro, British Pound, Japanese Yen, Canadian Dollar, Australian Dollar, Swiss Franc, Chinese Yuan, Indian Rupee, and Brazilian Real. Each currency displays with its proper symbol throughout the invoice.

Draft Auto-Save

We know invoice creation can be interrupted. Your work is automatically saved to your browser every few seconds, so you can close the tab and return later to continue exactly where you left off. This local storage ensures your data stays on your device, maintaining privacy while providing convenience.

Professional PDF Output

When you are ready to send, the Download PDF function creates a clean, professional document using your browser built-in print-to-PDF capability. The invoice is specially formatted for standard paper sizes with proper margins, ensuring it looks great whether printed or viewed digitally.

Use Cases

Freelancers use our generator for billing clients for design, development, writing, and consulting services. Small businesses create invoices for products and services without investing in expensive accounting software. Contractors bill for labor and materials with detailed line items. Consultants invoice for hourly or project-based work with professional documentation.

No Account Required

Unlike many invoice tools that require signup, subscriptions, or payment, our generator is completely free and requires no account. Simply visit the page, fill in your details, and download your invoice. There are no watermarks, no limits, and no hidden fees.

Privacy and Security

All invoice data stays in your browser. Nothing is uploaded to any server. Your client information, pricing, and business details remain completely private. When you close the browser or clear your data, everything is gone. This makes our tool ideal for sensitive business information.

Getting Started

Creating your first invoice takes just minutes. Start by selecting a template that matches your brand style. Add your company details and logo if you have one. Enter your client information. Add line items for each product or service. Set your tax rate if applicable. Review the preview and download your PDF. It is that simple. Professional invoicing should not be complicated or expensive.
`.trim();

export function InvoiceGeneratorPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="Invoice Generator"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All data stays in your browser - nothing is uploaded"
    >
      <InvoiceGenerator />
    </ToolLayout>
  );
}

export default InvoiceGeneratorPage;
