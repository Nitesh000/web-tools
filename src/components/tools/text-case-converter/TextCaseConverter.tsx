import { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { Undo2, Redo2, ArrowUpDown, Copy, Check, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { useFullscreen } from '../../../hooks/useFullscreen';
import { Button } from '../../common/Button';
import { useToast } from '../../common/Toast';

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
    .replace(/[_\-.]+/g, ' ') // snake_case, kebab-case, dot.case -> spaces
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
  const { showToast } = useToast();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
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
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy', 'error');
    }
  }, [outputText, showToast]);

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
    <div
      className={clsx(
        isFullscreen
          ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto p-6 space-y-6'
          : 'space-y-6'
      )}
    >
      {/* Fullscreen toggle */}
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={toggleFullscreen} leftIcon={isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}>
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </Button>
      </div>

      {/* Input Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="input-text"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
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
                  ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              )}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={clsx(
                'p-1.5 rounded-lg transition-colors',
                canRedo
                  ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              )}
              aria-label="Redo"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-5 h-5" />
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
            'w-full px-4 py-3 rounded-lg resize-y',
            isFullscreen ? 'h-[35vh]' : 'h-40',
            'bg-white border border-gray-300 dark:bg-gray-900/50 dark:border-gray-600/50',
            'text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
            'transition-colors'
          )}
          aria-describedby="text-stats"
        />

        {/* Statistics */}
        <div
          id="text-stats"
          className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400"
        >
          <span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{stats.characters}</span> characters
          </span>
          <span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{stats.charactersNoSpaces}</span> without spaces
          </span>
          <span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{stats.words}</span> words
          </span>
          <span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{stats.lines}</span> lines
          </span>
          <span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{stats.sentences}</span> sentences
          </span>
          <span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{stats.paragraphs}</span> paragraphs
          </span>
        </div>
      </div>

      {/* Conversion Buttons */}
      <div>
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Convert to:
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {caseButtons.map((button) => (
            <button
              key={button.type}
              onClick={() => handleConvert(button.type)}
              className={clsx(
                'px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                'border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
                activeCase === button.type
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-700/50 dark:border-gray-600/50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:border-gray-500'
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
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Converted Text
            {activeCase && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
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
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              )}
              title="Use converted text as input"
            >
              <ArrowUpDown className="w-4 h-4" />
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
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              )}
              aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
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
            'w-full px-4 py-3 rounded-lg resize-y',
            isFullscreen ? 'h-[35vh]' : 'h-40',
            'bg-white border border-gray-300 dark:bg-gray-900/50 dark:border-gray-600/50',
            'text-gray-900 placeholder-gray-400 dark:text-white dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
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
              ? 'bg-red-50 border border-red-300 text-red-600 hover:bg-red-100 dark:bg-red-600/20 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-600/30'
              : 'bg-gray-50 border border-gray-200 text-gray-300 dark:bg-gray-700/30 dark:border-gray-600/30 dark:text-gray-600 cursor-not-allowed'
          )}
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>
    </div>
  );
}

export default TextCaseConverter;
