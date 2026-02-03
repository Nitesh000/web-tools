import { ToolLayout } from '../components/common/ToolLayout';
import { JSONViewer } from '../components/tools/json-viewer/JSONViewer';

const seoMeta = {
  title: 'JSON Viewer Online - Free JSON Tree Viewer & Explorer | Web Tools Suite',
  description:
    'View and explore JSON data with our free online JSON viewer. Features full-screen mode, interactive tree navigation, search functionality, syntax highlighting, and instant formatting. No signup required - works entirely in your browser.',
  keywords: [
    'json viewer',
    'json viewer online',
    'free json viewer',
    'json tree viewer',
    'json explorer',
    'view json online',
    'json reader',
    'json browser',
    'json inspector',
    'json analyzer',
    'json data viewer',
    'online json viewer free',
    'json file viewer',
    'json structure viewer',
    'interactive json viewer',
    'json navigation tool',
    'json search tool',
    'fullscreen json viewer',
    'json visualizer online',
    'best json viewer 2024',
    'json viewer app',
    'json tree view online',
    'json object viewer',
    'json array viewer',
    'view json file',
    'json viewer no signup',
    'json viewer browser',
    'json viewer tool',
    'json expand collapse',
    'json pretty viewer',
  ],
  canonicalUrl: 'https://webtools.dev/json-viewer',
};

const howToUseSteps = [
  'Paste your JSON data into the input textarea on the left side of the viewer. You can also click "Load Sample" to see example JSON data.',
  'The JSON is automatically validated as you type. A green checkmark indicates valid JSON, while errors show the exact issue.',
  'Use the "Tree" view to explore JSON in an interactive, collapsible tree structure. Click on objects and arrays to expand or collapse them.',
  'Use the search box to find specific keys or values in your JSON. Matches are highlighted for easy navigation.',
  'Switch to "Formatted" view to see JSON with line numbers and proper indentation. Choose between 2, 4, or 8 space indentation.',
  'Click "Expand All" to expand every node in the tree, or "Collapse All" to collapse everything for a compact view.',
  'Use the "Fullscreen" button to maximize the viewer for large JSON documents. Press Escape to exit fullscreen mode.',
  'Click "Copy" to copy the formatted JSON to your clipboard, or "Download" to save it as a .json file.',
];

const faqs = [
  {
    question: 'What is a JSON Viewer and why do I need one?',
    answer:
      'A JSON viewer is an essential developer tool that helps you visualize, navigate, and understand JSON data. Raw JSON can be difficult to read, especially with complex nested structures. Our JSON viewer transforms raw JSON into an interactive tree that you can expand, collapse, and search. This makes debugging API responses, analyzing configuration files, and exploring data exports much easier.',
  },
  {
    question: 'How do I view a JSON file online?',
    answer:
      'To view a JSON file online, simply copy the JSON content and paste it into the input area on the left. The viewer instantly parses and displays your JSON in multiple formats: tree view for navigation, formatted view with line numbers, and raw view. You can also load a sample JSON to see how the viewer works.',
  },
  {
    question: 'Can I search within large JSON files?',
    answer:
      'Yes, our JSON viewer includes a powerful search feature. Type your search query in the search box, and the viewer will highlight all matching keys and values throughout your JSON structure. This is particularly useful when working with large API responses or configuration files where manual searching would be impractical.',
  },
  {
    question: 'What is the difference between Tree View and Formatted View?',
    answer:
      'Tree View displays JSON as an interactive, collapsible hierarchy where you can click to expand or collapse objects and arrays. It is ideal for exploring complex nested structures. Formatted View shows JSON as formatted text with line numbers, similar to a code editor. It is better for copying specific sections or seeing the raw structure.',
  },
  {
    question: 'Does the JSON viewer work with invalid JSON?',
    answer:
      'The viewer displays an error message when JSON is invalid, showing exactly what went wrong. This helps you identify and fix syntax errors like missing commas, unquoted keys, trailing commas, or mismatched brackets. Once you fix the error, the viewer immediately shows your valid JSON.',
  },
  {
    question: 'Is there a size limit for JSON files?',
    answer:
      'There is no strict size limit since all processing happens in your browser. Our viewer is optimized to handle large JSON files efficiently. For extremely large files (several megabytes), the tree view might take a moment to render, but you can use collapse all to improve performance.',
  },
  {
    question: 'Can I use the JSON viewer on mobile devices?',
    answer:
      'Yes, our JSON viewer is fully responsive and works on tablets and smartphones. The interface adapts to smaller screens while maintaining full functionality. However, for the best experience with large JSON documents, we recommend using a desktop browser.',
  },
  {
    question: 'Is my JSON data private and secure?',
    answer:
      'Absolutely. All JSON processing happens entirely in your web browser using JavaScript. Your data never leaves your device and is not uploaded to any server. When you close the browser tab, all data is cleared. This makes our viewer safe for sensitive data like API keys, configuration files, or proprietary information.',
  },
  {
    question: 'How do I download the formatted JSON?',
    answer:
      'Click the "Download" button in the toolbar to save your JSON as a .json file. Before downloading, you can choose your preferred indentation (2, 4, or 8 spaces) using the dropdown menu. The downloaded file will be properly formatted and ready for use.',
  },
  {
    question: 'What keyboard shortcuts are available?',
    answer:
      'Press Escape to exit fullscreen mode. In the input area, standard text editing shortcuts work (Ctrl+A to select all, Ctrl+C to copy, Ctrl+V to paste). The tree view responds to clicks for expand/collapse actions.',
  },
];

const relatedTools = [
  {
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format, validate, and convert JSON to YAML or TypeScript',
  },
  {
    name: 'Markdown Editor',
    href: '/markdown-editor',
    description: 'Write Markdown with live preview and auto-save',
  },
  {
    name: 'Text Case Converter',
    href: '/text-case-converter',
    description: 'Convert text between different case formats',
  },
  {
    name: 'Password Generator',
    href: '/password-generator',
    description: 'Generate secure random passwords',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Pick and convert colors between HEX, RGB, HSL',
  },
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Create customizable QR codes for URLs and text',
  },
];

const seoDescription = `
JSON (JavaScript Object Notation) is the backbone of modern web development. From REST APIs and GraphQL responses to configuration files and data exports, JSON is everywhere. When you're debugging an API response with hundreds of nested objects, or trying to understand a complex configuration file, raw JSON text becomes nearly impossible to read. That's where a JSON viewer becomes essential.

Why Use an Online JSON Viewer?

Our free online JSON viewer transforms unreadable JSON text into an interactive, explorable tree structure. Instead of squinting at brackets and commas, you see a clear hierarchy that you can expand and collapse with a single click. This visual representation makes it instantly clear how your data is structured, what properties exist, and where specific values are located.

Key Features for Developers

The tree view is the heart of our JSON viewer. Each object and array becomes a collapsible node that you can expand to see its contents or collapse to hide complexity you don't need. When working with deeply nested structures—common in API responses from services like Stripe, AWS, or Google APIs—this expand/collapse functionality is invaluable.

Our search feature lets you find specific keys or values instantly. Type a search term, and every match is highlighted throughout your JSON structure. No more scrolling through thousands of lines looking for a specific field. The search works on both property names and values, making it perfect for finding that one configuration setting or API response field you need.

Full-Screen Mode for Large Documents

Complex JSON documents deserve more screen space. Our full-screen mode expands the viewer to fill your entire browser window, giving you maximum room to explore your data. This is particularly useful when working with API responses that contain hundreds of properties or deeply nested structures. Press Escape anytime to return to the normal view.

Multiple View Modes

Different tasks call for different views. Tree view is perfect for exploration and understanding structure. Formatted view shows JSON as properly indented text with line numbers, ideal when you need to copy specific sections or reference line numbers. Raw view shows the JSON exactly as it was input, useful for copying the original data.

Instant Validation and Error Detection

Paste invalid JSON, and you'll immediately see exactly what's wrong. Our validator shows precise error messages indicating the line and character position of syntax errors. Common issues like missing commas, unquoted keys, trailing commas, and mismatched brackets are caught instantly, helping you fix problems before they cause issues in your applications.

Privacy-First Design

Every operation happens locally in your browser. Your JSON data—whether it's API keys, user information, or proprietary business data—never leaves your device. There are no server uploads, no cloud storage, and no data retention. When you close the tab, everything is gone. This makes our viewer safe for even the most sensitive JSON data.

Use Cases

Developers use our JSON viewer daily for debugging API responses by pasting raw response data to understand its structure. DevOps engineers explore Kubernetes manifests, Terraform state files, and cloud configuration exports. Data analysts visualize JSON exports from databases and analytics platforms. QA engineers verify API response structures match expected schemas. Security researchers examine JSON Web Tokens (JWTs) and API payloads.

Whether you're building web applications, debugging microservices, or analyzing data pipelines, a good JSON viewer saves hours of frustration. Our tool handles everything from simple objects to massive nested documents, all with the privacy and speed of local browser processing.

Performance Optimized

Our JSON viewer is built with performance in mind. The tree view uses efficient rendering that handles large documents without freezing your browser. Smart expand/collapse functionality means only visible nodes are rendered, keeping the interface responsive even with thousands of elements. The search algorithm is optimized for speed, providing instant results as you type.

No Installation Required

As a web-based tool, there's nothing to install or configure. Open the page, paste your JSON, and start exploring. Works on Chrome, Firefox, Safari, Edge, and any modern browser. No plugins, no extensions, no downloads. Bookmark the page and you have instant access to JSON viewing whenever you need it.

Try It Now

Paste your JSON into the viewer, or click "Load Sample" to see example data. Explore the tree view, try the search feature, and switch between viewing modes. Experience why developers worldwide rely on proper JSON tools for their daily work.
`.trim();

export function JSONViewerPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="JSON Viewer"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All processing happens locally in your browser"
    >
      <JSONViewer />
    </ToolLayout>
  );
}

export default JSONViewerPage;
