import { useState, useCallback, useEffect, useMemo } from 'react';
import clsx from 'clsx';

// Character sets for password generation
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS_CHARS = '0O1lI';
const SIMILAR_CHARS = '{}[]()\/\'"`~,;:.<>';

// Word list for passphrase generation
const WORD_LIST = [
  'apple', 'beach', 'cloud', 'dance', 'eagle', 'flame', 'grape', 'heart', 'ivory', 'jelly',
  'kite', 'lemon', 'maple', 'north', 'ocean', 'piano', 'queen', 'river', 'storm', 'tiger',
  'unity', 'vivid', 'whale', 'xerox', 'yacht', 'zebra', 'amber', 'brave', 'crisp', 'dream',
  'ember', 'frost', 'glow', 'honey', 'index', 'jumbo', 'karma', 'lunar', 'magic', 'noble',
  'orbit', 'prism', 'quest', 'royal', 'solar', 'torch', 'ultra', 'vital', 'wrist', 'youth',
  'blaze', 'charm', 'drift', 'event', 'flora', 'ghost', 'haste', 'intro', 'joker', 'knight',
  'lotus', 'mango', 'nexus', 'oasis', 'pearl', 'quilt', 'radar', 'stone', 'trend', 'urban',
  'voice', 'water', 'xenon', 'yield', 'zesty', 'arrow', 'bloom', 'coral', 'delta', 'epoch',
  'fiber', 'grain', 'haven', 'image', 'jewel', 'koala', 'layer', 'medal', 'niche', 'olive',
  'plaza', 'quote', 'ridge', 'spark', 'trail', 'upper', 'venue', 'width', 'xylem', 'young',
];

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
  excludeSimilar: boolean;
  count: number;
  isPassphrase: boolean;
  wordCount: number;
  wordSeparator: string;
  capitalizeWords: boolean;
  includeNumber: boolean;
}

interface GeneratedPassword {
  id: string;
  value: string;
  strength: PasswordStrength;
  entropy: number;
}

type PasswordStrength = 'very-weak' | 'weak' | 'fair' | 'strong' | 'very-strong';

// Cryptographically secure random number generator
function getSecureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xFFFFFFFF + 1);
}

function getSecureRandomInt(min: number, max: number): number {
  return Math.floor(getSecureRandom() * (max - min + 1)) + min;
}

// Calculate password entropy
function calculateEntropy(password: string, charsetSize: number): number {
  return Math.floor(password.length * Math.log2(charsetSize));
}

// Calculate password strength based on entropy
function getPasswordStrength(entropy: number): PasswordStrength {
  if (entropy < 28) return 'very-weak';
  if (entropy < 36) return 'weak';
  if (entropy < 60) return 'fair';
  if (entropy < 128) return 'strong';
  return 'very-strong';
}

// Strength labels and colors
const strengthConfig: Record<PasswordStrength, { label: string; color: string; bgColor: string; width: string }> = {
  'very-weak': { label: 'Very Weak', color: 'text-red-400', bgColor: 'bg-red-500', width: 'w-1/5' },
  'weak': { label: 'Weak', color: 'text-orange-400', bgColor: 'bg-orange-500', width: 'w-2/5' },
  'fair': { label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-500', width: 'w-3/5' },
  'strong': { label: 'Strong', color: 'text-lime-400', bgColor: 'bg-lime-500', width: 'w-4/5' },
  'very-strong': { label: 'Very Strong', color: 'text-green-400', bgColor: 'bg-green-500', width: 'w-full' },
};

export function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
    excludeSimilar: false,
    count: 1,
    isPassphrase: false,
    wordCount: 4,
    wordSeparator: '-',
    capitalizeWords: true,
    includeNumber: true,
  });

  const [passwords, setPasswords] = useState<GeneratedPassword[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Build character set based on options
  const charset = useMemo(() => {
    let chars = '';
    if (options.uppercase) chars += UPPERCASE;
    if (options.lowercase) chars += LOWERCASE;
    if (options.numbers) chars += NUMBERS;
    if (options.symbols) chars += SYMBOLS;

    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
    }
    if (options.excludeSimilar) {
      chars = chars.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
    }

    return chars;
  }, [options.uppercase, options.lowercase, options.numbers, options.symbols, options.excludeAmbiguous, options.excludeSimilar]);

  // Generate a single password
  const generatePassword = useCallback((): string => {
    if (options.isPassphrase) {
      const words: string[] = [];
      for (let i = 0; i < options.wordCount; i++) {
        let word = WORD_LIST[getSecureRandomInt(0, WORD_LIST.length - 1)];
        if (options.capitalizeWords) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        words.push(word);
      }
      let passphrase = words.join(options.wordSeparator);
      if (options.includeNumber) {
        passphrase += options.wordSeparator + getSecureRandomInt(0, 99);
      }
      return passphrase;
    }

    if (charset.length === 0) return '';

    let password = '';
    const charsetArray = charset.split('');

    for (let i = 0; i < options.length; i++) {
      password += charsetArray[getSecureRandomInt(0, charsetArray.length - 1)];
    }

    return password;
  }, [charset, options]);

  // Generate all passwords
  const generatePasswords = useCallback(() => {
    const newPasswords: GeneratedPassword[] = [];
    const charsetSize = options.isPassphrase
      ? WORD_LIST.length
      : charset.length;

    for (let i = 0; i < options.count; i++) {
      const value = generatePassword();
      const entropy = options.isPassphrase
        ? Math.floor(options.wordCount * Math.log2(WORD_LIST.length) + (options.includeNumber ? Math.log2(100) : 0))
        : calculateEntropy(value, charsetSize);

      newPasswords.push({
        id: crypto.randomUUID(),
        value,
        strength: getPasswordStrength(entropy),
        entropy,
      });
    }

    setPasswords(newPasswords);
    setCopiedId(null);
    setCopiedAll(false);
  }, [generatePassword, options.count, options.isPassphrase, options.wordCount, options.includeNumber, charset.length]);

  // Generate passwords on mount and when options change
  useEffect(() => {
    generatePasswords();
  }, [generatePasswords]);

  // Copy single password
  const copyPassword = async (password: GeneratedPassword) => {
    try {
      await navigator.clipboard.writeText(password.value);
      setCopiedId(password.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  // Copy all passwords
  const copyAllPasswords = async () => {
    try {
      const allPasswords = passwords.map(p => p.value).join('\n');
      await navigator.clipboard.writeText(allPasswords);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error('Failed to copy passwords:', err);
    }
  };

  // Update options helper
  const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  // Check if at least one character type is selected
  const hasValidOptions = options.isPassphrase || charset.length > 0;

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-slate-700/50 p-1">
          <button
            onClick={() => updateOption('isPassphrase', false)}
            className={clsx(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              !options.isPassphrase
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white'
            )}
          >
            Password
          </button>
          <button
            onClick={() => updateOption('isPassphrase', true)}
            className={clsx(
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              options.isPassphrase
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:text-white'
            )}
          >
            Passphrase
          </button>
        </div>
      </div>

      {/* Options Panel */}
      <div className="bg-slate-700/30 rounded-xl p-6 space-y-6">
        {!options.isPassphrase ? (
          <>
            {/* Password Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password-length" className="text-slate-300 font-medium">
                  Password Length
                </label>
                <span className="text-blue-400 font-mono text-lg">{options.length}</span>
              </div>
              <input
                id="password-length"
                type="range"
                min="8"
                max="128"
                value={options.length}
                onChange={(e) => updateOption('length', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>8</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Type Toggles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <ToggleOption
                id="uppercase"
                label="Uppercase (A-Z)"
                checked={options.uppercase}
                onChange={(checked) => updateOption('uppercase', checked)}
              />
              <ToggleOption
                id="lowercase"
                label="Lowercase (a-z)"
                checked={options.lowercase}
                onChange={(checked) => updateOption('lowercase', checked)}
              />
              <ToggleOption
                id="numbers"
                label="Numbers (0-9)"
                checked={options.numbers}
                onChange={(checked) => updateOption('numbers', checked)}
              />
              <ToggleOption
                id="symbols"
                label="Symbols (!@#$...)"
                checked={options.symbols}
                onChange={(checked) => updateOption('symbols', checked)}
              />
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ToggleOption
                id="exclude-ambiguous"
                label="Exclude ambiguous (0, O, l, 1, I)"
                checked={options.excludeAmbiguous}
                onChange={(checked) => updateOption('excludeAmbiguous', checked)}
              />
              <ToggleOption
                id="exclude-similar"
                label="Exclude similar ({}, [], (), etc.)"
                checked={options.excludeSimilar}
                onChange={(checked) => updateOption('excludeSimilar', checked)}
              />
            </div>
          </>
        ) : (
          <>
            {/* Passphrase Options */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="word-count" className="text-slate-300 font-medium">
                  Number of Words
                </label>
                <span className="text-blue-400 font-mono text-lg">{options.wordCount}</span>
              </div>
              <input
                id="word-count"
                type="range"
                min="3"
                max="10"
                value={options.wordCount}
                onChange={(e) => updateOption('wordCount', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <label htmlFor="word-separator" className="block text-slate-300 font-medium mb-2">
                Word Separator
              </label>
              <select
                id="word-separator"
                value={options.wordSeparator}
                onChange={(e) => updateOption('wordSeparator', e.target.value)}
                className="w-full bg-slate-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="-">Hyphen (-)</option>
                <option value="_">Underscore (_)</option>
                <option value=".">Period (.)</option>
                <option value=" ">Space ( )</option>
                <option value="">None</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <ToggleOption
                id="capitalize-words"
                label="Capitalize words"
                checked={options.capitalizeWords}
                onChange={(checked) => updateOption('capitalizeWords', checked)}
              />
              <ToggleOption
                id="include-number"
                label="Include number"
                checked={options.includeNumber}
                onChange={(checked) => updateOption('includeNumber', checked)}
              />
            </div>
          </>
        )}

        {/* Password Count */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password-count" className="text-slate-300 font-medium">
              Generate Multiple
            </label>
            <span className="text-blue-400 font-mono text-lg">{options.count}</span>
          </div>
          <input
            id="password-count"
            type="range"
            min="1"
            max="10"
            value={options.count}
            onChange={(e) => updateOption('count', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      </div>

      {/* Validation Message */}
      {!hasValidOptions && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-400 text-sm">
          Please select at least one character type to generate a password.
        </div>
      )}

      {/* Generated Passwords */}
      {hasValidOptions && passwords.length > 0 && (
        <div className="space-y-3">
          {passwords.map((password) => (
            <div
              key={password.id}
              className="bg-slate-700/30 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <code className="flex-1 text-white font-mono text-sm md:text-base break-all bg-slate-800/50 rounded-lg px-4 py-3">
                  {password.value}
                </code>
                <button
                  onClick={() => copyPassword(password)}
                  className={clsx(
                    'flex-shrink-0 p-3 rounded-lg transition-all',
                    copiedId === password.id
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white'
                  )}
                  aria-label={copiedId === password.id ? 'Copied!' : 'Copy password'}
                >
                  {copiedId === password.id ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <CopyIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Strength Indicator */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full transition-all duration-300 rounded-full',
                        strengthConfig[password.strength].bgColor,
                        strengthConfig[password.strength].width
                      )}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className={strengthConfig[password.strength].color}>
                    {strengthConfig[password.strength].label}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-400">
                    {password.entropy} bits entropy
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={generatePasswords}
          disabled={!hasValidOptions}
          className={clsx(
            'flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all',
            hasValidOptions
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-600 text-slate-400 cursor-not-allowed'
          )}
        >
          <RefreshIcon className="w-5 h-5" />
          Generate {options.isPassphrase ? 'Passphrase' : 'Password'}{options.count > 1 ? 's' : ''}
        </button>

        {passwords.length > 1 && (
          <button
            onClick={copyAllPasswords}
            className={clsx(
              'flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all',
              copiedAll
                ? 'bg-green-600 text-white'
                : 'bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white'
            )}
          >
            {copiedAll ? (
              <>
                <CheckIcon className="w-5 h-5" />
                Copied All!
              </>
            ) : (
              <>
                <CopyIcon className="w-5 h-5" />
                Copy All
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Toggle Option Component
interface ToggleOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleOption({ id, label, checked, onChange }: ToggleOptionProps) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
        checked
          ? 'bg-blue-900/30 border border-blue-700/50'
          : 'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700'
      )}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div
        className={clsx(
          'w-5 h-5 rounded flex items-center justify-center transition-all',
          checked ? 'bg-blue-600' : 'bg-slate-600'
        )}
      >
        {checked && <CheckIcon className="w-3 h-3 text-white" />}
      </div>
      <span className={clsx('text-sm', checked ? 'text-white' : 'text-slate-400')}>
        {label}
      </span>
    </label>
  );
}

// Icons
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

export default PasswordGenerator;
