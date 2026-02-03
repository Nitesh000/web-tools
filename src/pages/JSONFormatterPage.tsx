import { ToolLayout } from '../components/common/ToolLayout';
import { JSONFormatter } from '../components/tools/json-formatter/JSONFormatter';

const seoMeta = {
  title: 'JSON Formatter & Validator - Free Online JSON Beautifier | Web Tools Suite',
  description:
    'Format, validate, and beautify JSON data online for free. Features syntax highlighting, tree view, minification, JSON comparison, and conversion to YAML, TypeScript, and XML. No signup required.',
  keywords: [
    'json formatter',
    'json validator',
    'json beautifier',
    'json parser',
    'json viewer',
    'json editor',
    'json minifier',
    'pretty print json',
    'json to yaml',
    'json to typescript',
    'json to xml',
    'validate json',
    'format json online',
    'json syntax highlighter',
    'json tree view',
    'json compare',
    'json diff',
    'free json formatter',
  ],
  canonicalUrl: 'https://webtools.dev/json-formatter',
};

const howToUseSteps = [
  'Paste your JSON data into the input textarea on the left side. The tool will automatically validate and format it as you type.',
  'Click "Format" to beautify your JSON with proper indentation, or "Minify" to compress it into a single line.',
  'Use the indentation dropdown to choose between 2 spaces, 4 spaces, or tabs for formatting.',
  'Check the validation status indicator to see if your JSON is valid. Error messages show the exact line and column of any issues.',
  'Switch to "Tree View" to explore your JSON in a collapsible, hierarchical format. Use the search box to find specific keys or values.',
  'Use the "Compare" tab to compare two JSON documents and see added, removed, changed, and unchanged properties.',
  'Convert your JSON to other formats using the format buttons: JSON, YAML, TypeScript Interface, or XML.',
  'Click the copy icon to copy the output to your clipboard, or the download icon to save it as a file.',
];

const faqs = [
  {
    question: 'What can I do with this JSON formatter?',
    answer:
      'Our JSON formatter offers comprehensive functionality including beautifying/formatting JSON with customizable indentation, minifying JSON for smaller file sizes, validating JSON syntax with detailed error messages, viewing JSON in a tree structure, comparing two JSON documents, and converting JSON to YAML, TypeScript interfaces, or XML.',
  },
  {
    question: 'How do I fix invalid JSON?',
    answer:
      'When you paste invalid JSON, the tool displays an error message showing the exact line number, column, and description of the problem. Common issues include missing commas between elements, unquoted property names, trailing commas, single quotes instead of double quotes, and unescaped special characters in strings.',
  },
  {
    question: 'What is the difference between Format and Minify?',
    answer:
      'Format (or beautify) adds proper indentation, line breaks, and spacing to make JSON human-readable. Minify removes all unnecessary whitespace to create the smallest possible JSON string, ideal for production APIs, configuration files, and reducing network payload sizes.',
  },
  {
    question: 'How does the JSON comparison feature work?',
    answer:
      'The compare feature analyzes two JSON documents and categorizes differences into four groups: added properties (exist only in the second JSON), removed properties (exist only in the first JSON), changed values (same key but different value), and unchanged (identical in both). This is useful for debugging API responses or tracking configuration changes.',
  },
  {
    question: 'Can I convert JSON to TypeScript interfaces?',
    answer:
      'Yes! Click the "TypeScript Interface" button to generate TypeScript type definitions from your JSON. The tool analyzes the structure and creates properly typed interfaces including nested objects, arrays, and primitive types. This is invaluable for adding type safety to API responses in TypeScript projects.',
  },
  {
    question: 'What is the Tree View used for?',
    answer:
      'Tree View displays your JSON as an interactive, collapsible hierarchy. You can expand and collapse objects and arrays, search for specific keys or values, and understand the structure of complex nested data at a glance. It is particularly helpful for exploring large JSON responses from APIs.',
  },
  {
    question: 'Is there a size limit for JSON data?',
    answer:
      'There is no strict size limit since all processing happens in your browser. However, very large JSON files (several megabytes) may cause slower performance. For typical use cases like API responses, configuration files, and data exports, the tool works instantly.',
  },
  {
    question: 'Is my JSON data secure?',
    answer:
      'Yes, completely. All formatting, validation, and conversion happens entirely in your browser using JavaScript. Your JSON data is never uploaded to any server or stored anywhere. When you close the tab, all data is cleared.',
  },
];

const relatedTools = [
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
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Create QR codes for URLs and text',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Pick and convert colors between formats',
  },
  {
    name: 'Invoice Generator',
    href: '/invoice-generator',
    description: 'Create professional invoices as PDF',
  },
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images without losing quality',
  },
];

const seoDescription = `
JSON (JavaScript Object Notation) has become the universal language of data exchange on the web. From REST APIs to configuration files, from database exports to inter-service communication, JSON is everywhere. Our free online JSON formatter provides all the tools developers need to work with JSON efficiently.

Why Format JSON?

Raw JSON from APIs or minified production code is often a single line of text with no whitespace, making it nearly impossible to read or debug. Proper formatting adds indentation, line breaks, and spacing that makes the structure immediately visible. A well-formatted JSON document lets you quickly identify objects, arrays, nested structures, and individual values.

Validation and Error Detection

Invalid JSON causes applications to crash, APIs to fail, and debugging sessions to spiral into frustration. Our validator provides instant feedback as you type, highlighting exactly where problems occur. Common JSON syntax errors include missing commas between array elements or object properties, using single quotes instead of the required double quotes, forgetting to quote property names, including trailing commas (not allowed in standard JSON), and improper escaping of special characters.

When errors occur, we show the line number and column position along with a clear description, helping you fix issues in seconds rather than hunting through thousands of characters manually.

Tree View for Complex Data

Large JSON documents with deeply nested structures can be overwhelming even when formatted. Our tree view transforms JSON into a familiar file-explorer interface. Objects and arrays appear as expandable nodes, letting you drill down into the data structure without losing context. The search functionality helps you find specific keys or values instantly, even in massive documents.

JSON Comparison for Debugging

When debugging API issues or tracking configuration changes, you often need to compare two JSON documents. Our comparison tool performs a deep analysis, identifying properties that were added, removed, or modified between two versions. Color-coded results make differences immediately visible, saving hours of manual comparison.

Format Conversion

While JSON is ubiquitous, sometimes you need data in other formats. Our converter handles common transformations including conversion to YAML for configuration files and Kubernetes manifests, TypeScript interface generation for adding type safety to your code, and XML output for legacy systems and certain APIs.

The TypeScript interface generator is particularly powerful, analyzing your JSON structure and producing properly typed interfaces with nested types, arrays, and primitive types correctly inferred.

Indentation Options

Different projects use different conventions. Choose between 2-space indentation (common in JavaScript/TypeScript), 4-space indentation (common in Python and many other languages), or tab characters. The minify option removes all unnecessary whitespace for production use.

Syntax Highlighting

Our syntax highlighting uses distinct colors for different JSON elements: purple for property names, green for string values, blue for numbers, orange for booleans, and red for null values. This visual differentiation makes scanning JSON much faster than monochrome text.

Browser-Based Processing

Every operation happens in your browser using optimized JavaScript algorithms. There are no server uploads, no API calls, and no data storage. This ensures complete privacy for sensitive data like API keys, credentials, or proprietary information. It also means the tool works offline and processes data instantly regardless of your internet connection speed.

Use Cases

Developers use our JSON formatter for debugging API responses by pasting raw response data to visualize its structure. DevOps engineers format configuration files like package.json, tsconfig.json, and Kubernetes manifests. Data analysts explore JSON exports from databases and analytics platforms. Security professionals validate and inspect JSON Web Tokens (JWTs) and API payloads.

Whether you are building web applications, managing cloud infrastructure, or analyzing data, properly formatted JSON makes your work faster and less error-prone. Our tool handles everything from simple objects to massive nested documents, all with the privacy and speed of local browser processing.
`.trim();

export function JSONFormatterPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="JSON Formatter"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All processing happens locally in your browser"
    >
      <JSONFormatter />
    </ToolLayout>
  );
}

export default JSONFormatterPage;
