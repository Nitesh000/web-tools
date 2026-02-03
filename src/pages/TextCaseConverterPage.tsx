import { ToolLayout } from '../components/common/ToolLayout';
import { TextCaseConverter } from '../components/tools/text-case-converter/TextCaseConverter';

const seoMeta = {
  title: 'Text Case Converter - Free Online Case Changer Tool | Web Tools Suite',
  description:
    'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more. Free online text case converter with real-time conversion and character count.',
  keywords: [
    'text case converter',
    'case changer',
    'uppercase converter',
    'lowercase converter',
    'title case converter',
    'camelCase converter',
    'snake_case converter',
    'kebab-case converter',
    'PascalCase converter',
    'sentence case',
    'text formatter',
    'text transformation',
    'online text tool',
    'free case converter',
  ],
  canonicalUrl: 'https://webtools.dev/text-case-converter',
};

const howToUseSteps = [
  'Enter or paste your text into the input textarea. You can type directly or paste from any source.',
  'Choose from 12 different case conversion options by clicking the corresponding button.',
  'Your text will be converted instantly in real-time. The converted result appears in the output area below.',
  'Use the character count, word count, and line count statistics to track your text metrics.',
  'Click the "Copy" button to copy the converted text to your clipboard.',
  'Use the "Use as Input" button to chain multiple conversions together.',
  'Utilize the Undo/Redo buttons or keyboard shortcuts (Ctrl+Z, Ctrl+Y) to navigate through your editing history.',
  'Click "Clear All" to reset and start with fresh text.',
];

const faqs = [
  {
    question: 'What is text case conversion?',
    answer:
      'Text case conversion is the process of changing the capitalization style of text. Different cases serve different purposes: UPPERCASE for emphasis, lowercase for casual text, Title Case for headings, camelCase and PascalCase for programming, and snake_case or kebab-case for file naming and URLs.',
  },
  {
    question: 'What is the difference between camelCase and PascalCase?',
    answer:
      'Both are commonly used in programming. camelCase starts with a lowercase letter (e.g., "myVariableName") and is typically used for variable and function names in JavaScript, Java, and other languages. PascalCase starts with an uppercase letter (e.g., "MyClassName") and is commonly used for class names and React components.',
  },
  {
    question: 'When should I use snake_case vs kebab-case?',
    answer:
      'snake_case (words separated by underscores) is commonly used in Python, Ruby, and database column names. kebab-case (words separated by hyphens) is preferred for URLs, CSS class names, and file names because hyphens are more web-friendly and easier to read in URLs.',
  },
  {
    question: 'What is CONSTANT_CASE used for?',
    answer:
      'CONSTANT_CASE (also called SCREAMING_SNAKE_CASE) is used for constants in programming. It combines uppercase letters with underscores to make constants immediately recognizable in code. Examples include MAX_VALUE, API_KEY, or DATABASE_URL.',
  },
  {
    question: 'How does the Sentence case conversion work?',
    answer:
      'Sentence case capitalizes the first letter of each sentence while keeping the rest lowercase. It detects sentence boundaries by looking for periods, exclamation marks, and question marks. This is the standard capitalization style for most written content.',
  },
  {
    question: 'Is my text data safe when using this tool?',
    answer:
      'Yes, absolutely! All text processing happens entirely in your browser. Your text is never uploaded to any server or stored anywhere. When you close or refresh the page, all data is cleared. This ensures complete privacy for sensitive or confidential text.',
  },
  {
    question: 'Can I convert text with special characters or emojis?',
    answer:
      'Yes, the converter handles special characters, numbers, and emojis gracefully. Special characters and numbers remain unchanged during case conversion, while letters are transformed according to the selected case style.',
  },
  {
    question: 'What is the maximum text length I can convert?',
    answer:
      'There is no strict limit, but very large texts (over 100,000 characters) may cause slight performance delays. For typical use cases like converting documents, code snippets, or articles, the tool works instantly.',
  },
];

const relatedTools = [
  {
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format, validate, and beautify your JSON data',
  },
  {
    name: 'Password Generator',
    href: '/password-generator',
    description: 'Create strong, secure passwords instantly',
  },
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Generate QR codes for URLs, text, and more',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Pick and convert colors between formats',
  },
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images without losing quality',
  },
  {
    name: 'Format Converter',
    href: '/format-converter',
    description: 'Convert between different file formats',
  },
];

const seoDescription = `
Text case conversion is an essential tool for writers, developers, content creators, and anyone who works with text regularly. Whether you're preparing code, writing headlines, formatting content for social media, or organizing data, having the right text case can make a significant difference in readability and professionalism.

Our free online text case converter supports 12 different case styles, making it one of the most comprehensive text transformation tools available. The tool processes your text entirely in your browser, ensuring complete privacy and instant results without any server uploads or data storage.

Understanding Different Text Cases

UPPERCASE text is commonly used for acronyms, emphasis, and headlines. It commands attention and is often used in legal documents, warning signs, and titles. However, using all caps in digital communication is generally considered as "shouting," so use it sparingly.

lowercase text provides a casual, approachable tone. It's used in URLs, email addresses, and informal digital communication. Many modern brands use all lowercase for their names to appear more friendly and accessible.

Title Case capitalizes the first letter of each major word, making it ideal for book titles, article headlines, and formal documents. This style improves readability and gives text a polished, professional appearance.

Sentence case follows standard grammar rules, capitalizing only the first word of each sentence and proper nouns. This is the most natural reading style for paragraphs and long-form content.

Programming Case Styles

For developers, proper naming conventions are crucial for code readability and maintainability. camelCase is the standard for JavaScript variables and functions, where the first word is lowercase and subsequent words are capitalized. PascalCase (or UpperCamelCase) follows the same pattern but capitalizes the first word too, making it perfect for class names and React components.

snake_case uses underscores to separate words and is prevalent in Python, Ruby, and SQL. It's highly readable and works well for file names and database columns. kebab-case (or dash-case) uses hyphens instead and is the preferred style for URLs, CSS classes, and command-line arguments.

CONSTANT_CASE combines uppercase letters with underscores, making constants immediately identifiable in any codebase. This convention is used across virtually all programming languages for values that should never change.

dot.case separates words with periods and is commonly seen in configuration files, Java package names, and some logging systems.

Creative Text Transformations

Beyond standard case conversions, our tool includes creative options like Alternating Case (AlTeRnAtInG), which alternates between uppercase and lowercase letters. While not practical for formal writing, it's popular in memes and informal online communication.

The Reverse text feature mirrors your text character by character, useful for creating mirror effects, puzzles, or simply having fun with text.

Real-Time Statistics and Features

As you type or paste text, our converter provides instant statistics including character count (with and without spaces), word count, line count, sentence count, and paragraph count. These metrics are invaluable for writers working within character limits or word count requirements.

The tool includes a full undo/redo history, allowing you to experiment with different conversions and easily return to previous states. You can also chain conversions by using the "Use as Input" feature, applying multiple transformations in sequence.

All processing happens locally in your browser using efficient JavaScript algorithms. There are no API calls, no data transmission, and no waiting for server responses. Your text stays private, and conversions happen in milliseconds.

Whether you're a developer standardizing variable names, a writer crafting perfect headlines, a marketer preparing social media content, or a student formatting an assignment, our text case converter streamlines your workflow and ensures consistent, professional results every time.
`.trim();

export function TextCaseConverterPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="Text Case Converter"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All processing happens locally in your browser"
    >
      <TextCaseConverter />
    </ToolLayout>
  );
}

export default TextCaseConverterPage;
