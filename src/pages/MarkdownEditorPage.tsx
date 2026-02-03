import { ToolLayout } from '../components/common/ToolLayout';
import { MarkdownEditor } from '../components/tools/markdown-editor/MarkdownEditor';

const seoMeta = {
  title: 'Markdown Editor Online - Free MD Editor with Live Preview | Web Tools Suite',
  description:
    'Write and preview Markdown online with our free editor. Features live preview, auto-save to browser storage, templates, and export to .md or .html. No signup required - works entirely in your browser.',
  keywords: [
    'markdown editor',
    'markdown editor online',
    'free markdown editor',
    'online markdown editor',
    'markdown preview',
    'live markdown preview',
    'markdown writer',
    'md editor',
    'md editor online',
    'markdown generator',
    'markdown creator',
    'write markdown online',
    'markdown to html',
    'markdown to html converter',
    'github markdown editor',
    'readme editor',
    'readme generator',
    'markdown document editor',
    'best markdown editor',
    'best markdown editor online',
    'simple markdown editor',
    'markdown text editor',
    'markdown notepad',
    'markdown tool',
    'markdown download',
    'export markdown',
    'markdown file creator',
    'markdown with autosave',
    'browser markdown editor',
    'markdown editor no signup',
    'markdown live editor',
    'wysiwyg markdown editor',
    'markdown split view',
    'markdown side by side',
    'free md editor',
    'online md editor',
    'markdown blog editor',
    'markdown documentation editor',
  ],
  canonicalUrl: 'https://webtools.dev/markdown-editor',
};

const howToUseSteps = [
  'Start typing Markdown in the editor on the left side. Your content is automatically saved to your browser storage.',
  'See your formatted output instantly in the live preview panel on the right. The preview updates as you type.',
  'Use the toolbar buttons to quickly insert formatting: bold, italic, headings, links, images, code blocks, lists, and more.',
  'Choose from templates (README, Blog Post, Documentation, Meeting Notes) to start with pre-formatted structures.',
  'Switch between Split view (editor + preview), Edit only, or Preview only using the view mode buttons.',
  'Click the sidebar button to manage multiple documents. Create new documents, switch between them, or delete old ones.',
  'Use Full-screen mode for distraction-free writing. Press Escape to exit full-screen.',
  'Export your work by clicking ".md" to download as Markdown or ".html" to download as a styled HTML document.',
];

const faqs = [
  {
    question: 'What is Markdown and why should I use it?',
    answer:
      'Markdown is a lightweight markup language that lets you write formatted text using simple, readable syntax. For example, **text** makes text bold, # creates headings, and [text](url) creates links. It is the standard for README files on GitHub, documentation, blog posts, and note-taking. Markdown is easy to learn, portable across platforms, and converts cleanly to HTML.',
  },
  {
    question: 'Does this Markdown editor save my work automatically?',
    answer:
      'Yes, your content is automatically saved to your browser local storage every second. This means your work persists even if you accidentally close the browser, refresh the page, or your computer restarts. You can also manually save named documents to organize multiple files. The status bar shows when your work was last saved.',
  },
  {
    question: 'How do I create a README file for GitHub?',
    answer:
      'Select the "README" template from the templates dropdown. This gives you a pre-formatted structure with sections for project name, features, installation, usage, contributing, and license. Customize the content, then click ".md" to download. Upload the README.md file to your GitHub repository root directory.',
  },
  {
    question: 'Can I export my Markdown to HTML?',
    answer:
      'Yes, click the ".html" button to export your document as a complete HTML file with styling. The exported HTML includes proper formatting, code highlighting, and responsive design. It is ready to use as a standalone webpage or to paste into a website.',
  },
  {
    question: 'What Markdown syntax is supported?',
    answer:
      'Our editor supports all standard Markdown features: six levels of headings (# to ######), bold (**text**), italic (*text*), strikethrough (~~text~~), links [text](url), images ![alt](url), inline code (`code`), code blocks with syntax highlighting (```language), blockquotes (> text), ordered and unordered lists, horizontal rules (---), and more.',
  },
  {
    question: 'How do I add code blocks with syntax highlighting?',
    answer:
      'Wrap your code in triple backticks (```) and optionally specify the language for syntax highlighting. For example: ```javascript followed by your code, then ``` to close. The preview will display your code with proper formatting and monospace font.',
  },
  {
    question: 'Can I manage multiple documents?',
    answer:
      'Yes, click the sidebar button (hamburger menu icon) to open the document manager. You can create new documents, give them custom names, switch between documents, and delete documents you no longer need. Each document is saved separately in your browser storage.',
  },
  {
    question: 'Is there a word count feature?',
    answer:
      'Yes, the status bar at the bottom shows real-time word count, character count, and line count. This is useful for blog posts with word limits, academic writing, or any content where length matters.',
  },
  {
    question: 'Does the editor work offline?',
    answer:
      'Yes, since everything runs in your browser and saves to local storage, the editor works completely offline after the initial page load. You can write and edit documents without an internet connection. Your work will be there when you come back online.',
  },
  {
    question: 'Is my data private and secure?',
    answer:
      'Absolutely. All editing and storage happens locally in your browser. Your documents are stored in browser local storage on your device and are never uploaded to any server. Only you have access to your documents. Clearing your browser data will remove stored documents, so export important work.',
  },
  {
    question: 'What are the available templates?',
    answer:
      'We provide four templates: README (for GitHub projects with standard sections), Blog Post (with title, introduction, sections, and conclusion), Documentation (with API reference, configuration tables, and FAQ), and Meeting Notes (with agenda, discussion points, and action items). Each template provides a professional starting structure.',
  },
  {
    question: 'Can I use keyboard shortcuts?',
    answer:
      'Standard text editing shortcuts work in the editor: Ctrl+A (select all), Ctrl+C (copy), Ctrl+V (paste), Ctrl+Z (undo), Ctrl+Y (redo). Use the toolbar buttons for Markdown-specific formatting, or memorize the Markdown syntax for the fastest writing experience.',
  },
];

const relatedTools = [
  {
    name: 'JSON Viewer',
    href: '/json-viewer',
    description: 'View and explore JSON data with tree navigation',
  },
  {
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format, validate, and convert JSON',
  },
  {
    name: 'Text Case Converter',
    href: '/text-case-converter',
    description: 'Convert text between different case formats',
  },
  {
    name: 'Invoice Generator',
    href: '/invoice-generator',
    description: 'Create professional invoices as PDF',
  },
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Create QR codes for URLs and text',
  },
  {
    name: 'Password Generator',
    href: '/password-generator',
    description: 'Generate secure random passwords',
  },
];

const seoDescription = `
Markdown has revolutionized how developers, writers, and content creators produce formatted text. From GitHub README files to documentation sites, from blog posts to personal notes, Markdown's simple syntax delivers professional formatting without the complexity of word processors or HTML. Our free online Markdown editor gives you everything you need to write, preview, and export beautiful Markdown documents.

Why Choose an Online Markdown Editor?

Desktop Markdown editors require installation, updates, and often come with subscription fees. Our browser-based editor works instantly—no downloads, no signups, no payments. Open the page and start writing. Your work is automatically saved to your browser, so you never lose progress. Whether you're on your home computer, work laptop, or a friend's machine, your Markdown editing environment is just a URL away.

Live Preview: See What You're Creating

The split-screen view shows your Markdown on the left and the rendered output on the right, updating in real-time as you type. No more switching between edit and preview modes. No more guessing how your formatting will look. See headings, bold text, code blocks, and lists exactly as they'll appear in the final document.

For focused writing, switch to edit-only mode to maximize your writing space. When you're ready to review, switch to preview-only mode for a clean reading experience. The view modes adapt to how you work, not the other way around.

Auto-Save: Never Lose Your Work

Every keystroke is automatically saved to your browser's local storage. Close your browser, restart your computer, or get interrupted—your work is safe. The status bar shows exactly when your last save occurred, giving you peace of mind while you write. For important documents, the manual save feature lets you create named versions you can access anytime.

Document Management for Multiple Projects

Working on multiple Markdown files? The sidebar lets you create, name, and organize separate documents. Switch between your GitHub README, your blog post draft, and your meeting notes with a single click. Each document maintains its own content and save state, making it easy to manage multiple projects.

Professional Templates for Quick Starts

Starting from a blank page can be daunting. Our templates provide professional starting structures for common use cases:

The README template follows GitHub best practices with sections for project description, features, installation instructions, usage examples, contributing guidelines, and licensing. Perfect for open-source projects.

The Blog Post template includes a title, featured image placeholder, introduction, structured body sections, and a conclusion with call-to-action. Ideal for content creators and technical bloggers.

The Documentation template features an overview, getting started guide, API reference with code examples, configuration tables, FAQ section, and support information. Great for software documentation.

The Meeting Notes template provides a dated structure with attendees, agenda items, discussion points, action items with assignees, and next meeting details. Perfect for keeping meetings organized.

Export Options: Markdown and HTML

When you're done writing, export your document in the format you need. Download as .md to get a pure Markdown file ready for GitHub, GitLab, or any Markdown-compatible platform. Download as .html to get a complete, styled webpage that you can open in any browser or integrate into a website.

The HTML export includes professional styling with proper typography, code formatting, responsive design, and dark mode support. It's a complete document, not just raw HTML—open it and see your formatted content immediately.

Toolbar for Fast Formatting

The toolbar provides one-click access to common Markdown formatting:
- Text styling: Bold, Italic, Strikethrough
- Headings: H1, H2, H3 (and more via syntax)
- Links and Images: With proper Markdown syntax
- Code: Inline code and code blocks
- Lists: Bullet points and numbered lists
- Block elements: Quotes and horizontal rules

Click any button to insert the appropriate Markdown syntax at your cursor position. Selected text is automatically wrapped in the formatting tags.

Full-Screen for Distraction-Free Writing

When you need to focus, full-screen mode removes all distractions. The editor expands to fill your entire screen, giving you maximum writing space. The toolbar remains accessible for formatting, but everything else fades away. Press Escape to return to normal view when you're ready.

Privacy and Security

Your documents never leave your device. There are no server uploads, no cloud syncing, and no accounts to create. Everything is stored in your browser's local storage, which only you can access. This makes our editor safe for sensitive content, proprietary documentation, and private notes.

Word Count and Statistics

The status bar displays real-time statistics as you write: word count, character count, and line count. For blog posts with word limits, documentation with length guidelines, or any content where size matters, you always know exactly where you stand.

Mobile-Friendly Design

While Markdown editing is best on a desktop with a full keyboard, our editor works on tablets and larger phones too. The interface adapts to smaller screens while maintaining core functionality. Write a quick README update on your tablet or review your blog post on your phone.

Perfect for Developers, Writers, and Everyone

Software developers use our editor for README files, documentation, and code comments. Technical writers create user guides, API documentation, and knowledge base articles. Bloggers draft posts with proper formatting before publishing to their platforms. Students take structured notes that export cleanly to study materials. Anyone who values clean, portable formatting finds Markdown invaluable.

Start Writing Now

No signup required. No credit card needed. No software to install. Just open the editor and start creating. Try a template to see what's possible, or start from scratch with your own content. Your words, formatted beautifully, exported easily.
`.trim();

export function MarkdownEditorPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="Markdown Editor"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All processing happens locally in your browser"
    >
      <MarkdownEditor />
    </ToolLayout>
  );
}

export default MarkdownEditorPage;
