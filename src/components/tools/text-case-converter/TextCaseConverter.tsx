import { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';

type CaseType =
  | 'uppercase'
  | 'lowercase'
  | 'titleCase'
  | 'sentenceCase'
  | 'camelCase'
  | 'pascalCase'
  | 'snakeCase'
  | 'kebabCase'
  | 'constantCase'
  | 'dotCase'
  | 'alternatingCase'
  | 'reverse';

interface HistoryEntry {
  text: string;
  timestamp: number;
}

interface CaseButton {
  type: CaseType;
  label: string;
  example: string;
}

const caseButtons: CaseButton[] = [
  { type: 'uppercase', label: 'UPPERCASE', example: 'HELLO WORLD' },
  { type: 'lowercase', label: 'lowercase', example: 'hello world' },
  { type: 'titleCase', label: 'Title Case', example: 'Hello World' },
  { type: 'sentenceCase', label: 'Sentence case', example: 'Hello world' },
  { type: 'camelCase', label: 'camelCase', example: 'helloWorld' },
  { type: 'pascalCase', label: 'PascalCase', example: 'HelloWorld' },
  { type: 'snakeCase', label: 'snake_case', example: 'hello_world' },
  { type: 'kebabCase', label: 'kebab-case', example: 'hello-world' },
  { type: 'constantCase', label: 'CONSTANT_CASE', example: 'HELLO_WORLD' },
  { type: 'dotCase', label: 'dot.case', example: 'hello.world' },
  { type: 'alternatingCase', label: 'AlTeRnAtInG', example: 'HeLlO wOrLd' },
  { type: 'reverse', label: 'Reverse', example: 'dlrow olleh' },
];

// Helper function to split text into words
function splitIntoWords(text: string): string[] {
  // Handle camelCase, PascalCase, snake_case, kebab-case, dot.case, etc.
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase -> camel Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // XMLParser -> XML Parser
    .replace(/[_\-\.]+/g, ' ') // snake_case, kebab-case, dot.case -> spaces
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

// Case conversion functions
function toUpperCase(text: string): string {
  return text.toUpperCase();
}

function toLowerCase(text: string): string {
  return text.toLowerCase();
}

function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(?:^|\s|["'([{])\S/g, (char) => char.toUpperCase());
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase());
}

function toCamelCase(text: string): string {
  const words = splitIntoWords(text);
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      return index === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

function toPascalCase(text: string): string {
  const words = splitIntoWords(text);
  return words
    .map((word) => {
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

function toSnakeCase(text: string): string {
  const words = splitIntoWords(text);
  return words.map((word) => word.toLowerCase()).join('_');
}

function toKebabCase(text: string): string {
  const words = splitIntoWords(text);
  return words.map((word) => word.toLowerCase()).join('-');
}

function toConstantCase(text: string): string {
  const words = splitIntoWords(text);
  return words.map((word) => word.toUpperCase()).join('_');
}

function toDotCase(text: string): string {
  const words = splitIntoWords(text);
  return words.map((word) => word.toLowerCase()).join('.');
}

function toAlternatingCase(text: string): string {
  let upper = true;
  return text
    .split('')
    .map((char) => {
      if (/[a-zA-Z]/.test(char)) {
        const result = upper ? char.toUpperCase() : char.toLowerCase();
        upper = !upper;
        return result;
      }
      return char;
    })
    .join('');
}

function toReverse(text: string): string {
  return text.split('').reverse().join('');
}

const converters: Record<CaseType, (text: string) => string> = {
  uppercase: toUpperCase,
  lowercase: toLowerCase,
  titleCase: toTitleCase,
  sentenceCase: toSentenceCase,
  camelCase: toCamelCase,
  pascalCase: toPascalCase,
  snakeCase: toSnakeCase,
  kebabCase: toKebabCase,
  constantCase: toConstantCase,
  dotCase: toDotCase,
  alternatingCase: toAlternatingCase,
  reverse: toReverse,
};

export function TextCaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([{ text: '', timestamp: Date.now() }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Text statistics
  const stats = useMemo(() => {
    const text = inputText;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;

    return { characters, charactersNoSpaces, words, lines, sentences, paragraphs };
  }, [inputText]);

  // Add to history
  const addToHistory = useCallback((text: string) => {
    setHistory((prev) => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add new entry
      newHistory.push({ text, timestamp: Date.now() });
      // Keep only last 50 entries
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    addToHistory(newText);

    // Real-time conversion if a case is selected
    if (activeCase) {
      setOutputText(converters[activeCase](newText));
    }
  }, [activeCase, addToHistory]);

  // Handle case conversion
  const handleConvert = useCallback((caseType: CaseType) => {
    setActiveCase(caseType);
    const converted = converters[caseType](inputText);
    setOutputText(converted);
  }, [inputText]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousText = history[newIndex].text;
      setInputText(previousText);
      if (activeCase) {
        setOutputText(converters[activeCase](previousText));
      }
    }
  }, [historyIndex, history, activeCase]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextText = history[newIndex].text;
      setInputText(nextText);
      if (activeCase) {
        setOutputText(converters[activeCase](nextText));
      }
    }
  }, [historyIndex, history, activeCase]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    if (outputText) {
      try {
        await navigator.clipboard.writeText(outputText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [outputText]);

  // Clear all
  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setActiveCase(null);
    setHistory([{ text: '', timestamp: Date.now() }]);
    setHistoryIndex(0);
  }, []);

  // Use converted text as input
  const handleUseAsInput = useCallback(() => {
    if (outputText) {
      setInputText(outputText);
      addToHistory(outputText);
      setOutputText('');
      setActiveCase(null);
    }
  }, [outputText, addToHistory]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="input-text"
            className="block text-sm font-medium text-slate-300"
          >
            Input Text
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={clsx(
                'p-1.5 rounded-lg transition-colors',
                canUndo
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-slate-600 cursor-not-allowed'
              )}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a4 4 0 0 1 4 4v2M3 10l4-4m-4 4l4 4" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={clsx(
                'p-1.5 rounded-lg transition-colors',
                canRedo
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                  : 'text-slate-600 cursor-not-allowed'
              )}
              aria-label="Redo"
              title="Redo (Ctrl+Y)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a4 4 0 0 0-4 4v2m14-6l-4-4m4 4l-4 4" />
              </svg>
            </button>
          </div>
        </div>
        <textarea
          id="input-text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.ctrlKey || e.metaKey) {
              if (e.key === 'z') {
                e.preventDefault();
                handleUndo();
              } else if (e.key === 'y') {
                e.preventDefault();
                handleRedo();
              }
            }
          }}
          placeholder="Enter or paste your text here..."
          className={clsx(
            'w-full h-40 px-4 py-3 rounded-xl resize-y',
            'bg-slate-900/50 border border-slate-600/50',
            'text-white placeholder-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors'
          )}
          aria-describedby="text-stats"
        />

        {/* Statistics */}
        <div
          id="text-stats"
          className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400"
        >
          <span>
            <span className="font-medium text-slate-300">{stats.characters}</span> characters
          </span>
          <span>
            <span className="font-medium text-slate-300">{stats.charactersNoSpaces}</span> without spaces
          </span>
          <span>
            <span className="font-medium text-slate-300">{stats.words}</span> words
          </span>
          <span>
            <span className="font-medium text-slate-300">{stats.lines}</span> lines
          </span>
          <span>
            <span className="font-medium text-slate-300">{stats.sentences}</span> sentences
          </span>
          <span>
            <span className="font-medium text-slate-300">{stats.paragraphs}</span> paragraphs
          </span>
        </div>
      </div>

      {/* Conversion Buttons */}
      <div>
        <h2 className="text-sm font-medium text-slate-300 mb-3">
          Convert to:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {caseButtons.map((button) => (
            <button
              key={button.type}
              onClick={() => handleConvert(button.type)}
              className={clsx(
                'px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                'border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800',
                activeCase === button.type
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
              )}
              title={`Example: ${button.example}`}
              aria-pressed={activeCase === button.type}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="output-text"
            className="block text-sm font-medium text-slate-300"
          >
            Converted Text
            {activeCase && (
              <span className="ml-2 text-blue-400">
                ({caseButtons.find((b) => b.type === activeCase)?.label})
              </span>
            )}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUseAsInput}
              disabled={!outputText}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                'flex items-center gap-1.5',
                outputText
                  ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'text-slate-600 cursor-not-allowed'
              )}
              title="Use converted text as input"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              <span className="hidden sm:inline">Use as Input</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                'flex items-center gap-1.5',
                outputText
                  ? copied
                    ? 'bg-green-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'text-slate-600 cursor-not-allowed'
              )}
              aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
        <textarea
          id="output-text"
          value={outputText}
          readOnly
          placeholder="Converted text will appear here..."
          className={clsx(
            'w-full h-40 px-4 py-3 rounded-xl resize-y',
            'bg-slate-900/50 border border-slate-600/50',
            'text-white placeholder-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'transition-colors'
          )}
        />
      </div>

      {/* Clear Button */}
      <div className="flex justify-end">
        <button
          onClick={handleClear}
          disabled={!inputText && !outputText}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            'flex items-center gap-2',
            inputText || outputText
              ? 'bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30'
              : 'bg-slate-700/30 border border-slate-600/30 text-slate-600 cursor-not-allowed'
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      </div>
    </div>
  );
}

export default TextCaseConverter;
