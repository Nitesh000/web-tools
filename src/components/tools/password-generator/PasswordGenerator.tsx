import { useState, useCallback, useEffect, useMemo } from "react";
import clsx from "clsx";
import { Button } from "../../common/Button";
import { Select } from "../../common/Select";
import { Slider } from "../../common/Slider";
import { useToast } from "../../common/Toast";

// Character sets for password generation
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS_CHARS = "0O1lI";
const SIMILAR_CHARS = "{}[]()/'\"`~,;:.<>";

// Word list for passphrase generation
const WORD_LIST = [
  "adapt",
  "adore",
  "adult",
  "after",
  "again",
  "agent",
  "agree",
  "ahead",
  "alarm",
  "album",
  "alert",
  "alien",
  "alive",
  "allow",
  "alone",
  "along",
  "alter",
  "amaze",
  "among",
  "angel",
  "anger",
  "angle",
  "angry",
  "apart",
  "apply",
  "arena",
  "argue",
  "arise",
  "aside",
  "asset",
  "audio",
  "avoid",
  "awake",
  "award",
  "aware",
  "badly",
  "basic",
  "basis",
  "batch",
  "begin",
  "being",
  "below",
  "bench",
  "berry",
  "birth",
  "black",
  "blame",
  "blank",
  "blast",
  "blend",
  "bless",
  "blind",
  "block",
  "blood",
  "board",
  "bonus",
  "brain",
  "brand",
  "bread",
  "break",
  "brick",
  "brief",
  "bring",
  "broad",
  "brown",
  "build",
  "built",
  "buyer",
  "cabin",
  "cable",
  "carry",
  "catch",
  "cause",
  "chain",
  "chair",
  "cheap",
  "check",
  "chest",
  "chief",
  "child",
  "china",
  "chose",
  "civil",
  "claim",
  "class",
  "clean",
  "clear",
  "clerk",
  "click",
  "climb",
  "clock",
  "close",
  "coach",
  "coast",
  "color",
  "comic",
  "common",
  "coral",
  "count",
  "court",
  "cover",
  "crack",
  "craft",
  "crash",
  "crazy",
  "cream",
  "crime",
  "cross",
  "crowd",
  "crown",
  "cycle",
  "daily",
  "dairy",
  "dealt",
  "death",
  "debut",
  "decay",
  "delay",
  "depth",
  "devil",
  "diary",
  "digit",
  "dirty",
  "doing",
  "doubt",
  "dozen",
  "draft",
  "drama",
  "drawn",
  "dream",
  "dress",
  "drink",
  "drive",
  "drove",
  "early",
  "earth",
  "eight",
  "elect",
  "email",
  "empty",
  "enemy",
  "enjoy",
  "enter",
  "entry",
  "equal",
  "error",
  "essay",
  "ethic",
  "every",
  "exact",
  "exist",
  "extra",
  "faith",
  "false",
  "fancy",
  "fatal",
  "fault",
  "favor",
  "feast",
  "field",
  "fifth",
  "fifty",
  "fight",
  "final",
  "first",
  "fixed",
  "flash",
  "fleet",
  "floor",
  "flour",
  "focus",
  "force",
  "frame",
  "fresh",
  "front",
  "fruit",
  "fully",
  "funny",
  "giant",
  "given",
  "glass",
  "globe",
  "going",
  "grace",
  "grade",
  "grand",
  "grant",
  "grass",
  "great",
  "green",
  "gross",
  "group",
  "guard",
  "guess",
  "guest",
  "guide",
  "happy",
  "harsh",
  "heavy",
  "hello",
  "hence",
  "horse",
  "hotel",
  "house",
  "human",
  "ideal",
  "image",
  "imply",
  "inner",
  "input",
  "issue",
  "japan",
  "joint",
  "judge",
  "juice",
  "known",
  "label",
  "large",
  "later",
  "laugh",
  "learn",
  "least",
  "leave",
  "legal",
  "level",
  "light",
  "limit",
  "local",
  "logic",
  "loose",
  "lucky",
  "lunch",
  "lying",
  "major",
  "maker",
  "march",
  "match",
  "maybe",
  "mayor",
  "means",
  "metal",
  "might",
  "minor",
  "model",
  "money",
  "month",
  "moral",
  "motor",
  "mouse",
  "mouth",
  "movie",
  "music",
  "never",
  "night",
  "noise",
  "novel",
  "nurse",
  "occur",
  "offer",
  "often",
  "order",
  "other",
  "ought",
  "paint",
  "panel",
  "paper",
  "party",
  "pause",
  "peace",
  "phone",
  "photo",
  "piece",
  "pilot",
  "pitch",
  "place",
  "plain",
  "plane",
  "plant",
  "plate",
  "point",
  "power",
  "press",
  "price",
  "pride",
  "prime",
  "print",
  "prior",
  "prize",
  "proof",
  "proud",
  "prove",
  "quick",
  "quiet",
  "quite",
  "radio",
  "raise",
  "range",
  "rapid",
  "ratio",
  "reach",
  "ready",
  "refer",
  "relax",
  "reply",
  "right",
  "rough",
  "round",
  "route",
  "rural",
  "scale",
  "scene",
  "scope",
  "score",
  "sense",
  "serve",
  "seven",
  "shape",
  "share",
  "sharp",
  "sheet",
  "shift",
  "shirt",
  "shock",
  "shoot",
  "short",
  "shown",
  "sight",
  "since",
  "sixth",
  "skill",
  "sleep",
  "slice",
  "small",
  "smart",
  "smile",
  "smoke",
  "solid",
  "solve",
  "sound",
  "south",
  "space",
  "spare",
  "speak",
  "speed",
  "spend",
  "spoke",
  "sport",
  "staff",
  "stage",
  "stand",
  "start",
  "state",
  "steam",
  "steel",
  "stick",
  "still",
  "stock",
  "store",
  "story",
  "study",
  "stuff",
  "style",
  "sugar",
  "suite",
  "sweet",
  "table",
  "taste",
  "teach",
  "thank",
  "their",
  "theme",
  "there",
  "these",
  "thing",
  "think",
  "third",
  "those",
  "three",
  "throw",
  "tight",
  "today",
  "topic",
  "total",
  "touch",
  "tower",
  "track",
  "trade",
  "train",
  "treat",
  "trend",
  "trial",
  "tribe",
  "trick",
  "truck",
  "trust",
  "truth",
  "twice",
  "under",
  "union",
  "until",
  "usual",
  "value",
  "video",
  "visit",
  "visual",
  "waste",
  "watch",
  "wheel",
  "where",
  "which",
  "while",
  "white",
  "whole",
  "whose",
  "woman",
  "world",
  "worry",
  "worth",
  "write",
  "wrong",
  "young",
  "yours",
  "zonal",
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

type PasswordStrength =
  "very-weak" | "weak" | "fair" | "strong" | "very-strong";

// Cryptographically secure random number generator
function getSecureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
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
  if (entropy < 28) return "very-weak";
  if (entropy < 36) return "weak";
  if (entropy < 60) return "fair";
  if (entropy < 128) return "strong";
  return "very-strong";
}

// Strength labels and colors
const strengthConfig: Record<
  PasswordStrength,
  { label: string; color: string; bgColor: string; width: string }
> = {
  "very-weak": {
    label: "Very Weak",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-500",
    width: "w-1/5",
  },
  weak: {
    label: "Weak",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-500",
    width: "w-2/5",
  },
  fair: {
    label: "Fair",
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-500",
    width: "w-3/5",
  },
  strong: {
    label: "Strong",
    color: "text-lime-600 dark:text-lime-400",
    bgColor: "bg-lime-500",
    width: "w-4/5",
  },
  "very-strong": {
    label: "Very Strong",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-500",
    width: "w-full",
  },
};

export function PasswordGenerator() {
  const { showToast } = useToast();
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
    wordSeparator: "-",
    capitalizeWords: true,
    includeNumber: true,
  });

  const [passwords, setPasswords] = useState<GeneratedPassword[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Build character set based on options
  const charset = useMemo(() => {
    let chars = "";
    if (options.uppercase) chars += UPPERCASE;
    if (options.lowercase) chars += LOWERCASE;
    if (options.numbers) chars += NUMBERS;
    if (options.symbols) chars += SYMBOLS;

    if (options.excludeAmbiguous) {
      chars = chars
        .split("")
        .filter((c) => !AMBIGUOUS_CHARS.includes(c))
        .join("");
    }
    if (options.excludeSimilar) {
      chars = chars
        .split("")
        .filter((c) => !SIMILAR_CHARS.includes(c))
        .join("");
    }

    return chars;
  }, [
    options.uppercase,
    options.lowercase,
    options.numbers,
    options.symbols,
    options.excludeAmbiguous,
    options.excludeSimilar,
  ]);

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

    if (charset.length === 0) return "";

    let password = "";
    const charsetArray = charset.split("");

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
        ? Math.floor(
            options.wordCount * Math.log2(WORD_LIST.length) +
              (options.includeNumber ? Math.log2(100) : 0),
          )
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
  }, [
    generatePassword,
    options.count,
    options.isPassphrase,
    options.wordCount,
    options.includeNumber,
    charset.length,
  ]);

  // Generate passwords on mount and when options change
  useEffect(() => {
    generatePasswords();
  }, [generatePasswords]);

  // Copy single password
  const copyPassword = async (password: GeneratedPassword) => {
    try {
      await navigator.clipboard.writeText(password.value);
      setCopiedId(password.id);
      showToast("Password copied to clipboard", "success");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy password:", err);
      showToast("Failed to copy", "error");
    }
  };

  // Copy all passwords
  const copyAllPasswords = async () => {
    try {
      const allPasswords = passwords.map((p) => p.value).join("\n");
      await navigator.clipboard.writeText(allPasswords);
      setCopiedAll(true);
      showToast(`Copied ${passwords.length} passwords to clipboard`, "success");
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error("Failed to copy passwords:", err);
      showToast("Failed to copy", "error");
    }
  };

  // Update options helper
  const updateOption = <K extends keyof PasswordOptions>(
    key: K,
    value: PasswordOptions[K],
  ) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  // Check if at least one character type is selected
  const hasValidOptions = options.isPassphrase || charset.length > 0;

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-gray-100 rounded-lg dark:bg-gray-700/50">
          <button
            onClick={() => updateOption("isPassphrase", false)}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              !options.isPassphrase
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
            )}
          >
            Password
          </button>
          <button
            onClick={() => updateOption("isPassphrase", true)}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              options.isPassphrase
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
            )}
          >
            Passphrase
          </button>
        </div>
      </div>

      {/* Options Panel */}
      <div className="p-6 space-y-6 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        {!options.isPassphrase ? (
          <>
            {/* Password Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password-length"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Password Length
                </label>
                <span className="font-mono text-lg text-blue-600 dark:text-blue-400">
                  {options.length}
                </span>
              </div>
              <input
                id="password-length"
                type="range"
                min="8"
                max="128"
                value={options.length}
                onChange={(e) =>
                  updateOption("length", parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                <span>8</span>
                <span>128</span>
              </div>
            </div>

            {/* Character Type Toggles */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <ToggleOption
                id="uppercase"
                label="Uppercase (A-Z)"
                checked={options.uppercase}
                onChange={(checked) => updateOption("uppercase", checked)}
              />
              <ToggleOption
                id="lowercase"
                label="Lowercase (a-z)"
                checked={options.lowercase}
                onChange={(checked) => updateOption("lowercase", checked)}
              />
              <ToggleOption
                id="numbers"
                label="Numbers (0-9)"
                checked={options.numbers}
                onChange={(checked) => updateOption("numbers", checked)}
              />
              <ToggleOption
                id="symbols"
                label="Symbols (!@#$...)"
                checked={options.symbols}
                onChange={(checked) => updateOption("symbols", checked)}
              />
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ToggleOption
                id="exclude-ambiguous"
                label="Exclude ambiguous (0, O, l, 1, I)"
                checked={options.excludeAmbiguous}
                onChange={(checked) =>
                  updateOption("excludeAmbiguous", checked)
                }
              />
              <ToggleOption
                id="exclude-similar"
                label="Exclude similar ({}, [], (), etc.)"
                checked={options.excludeSimilar}
                onChange={(checked) => updateOption("excludeSimilar", checked)}
              />
            </div>
          </>
        ) : (
          <>
            {/* Passphrase Options */}
            <Slider
              id="word-count"
              label={`Number of Words: ${options.wordCount}`}
              minLabel="3"
              maxLabel="10"
              min="3"
              max="10"
              value={options.wordCount}
              onChange={(e) =>
                updateOption("wordCount", parseInt(e.target.value))
              }
            />

            <Select
              id="word-separator"
              label="Word Separator"
              value={options.wordSeparator}
              onChange={(e) => updateOption("wordSeparator", e.target.value)}
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value=".">Period (.)</option>
              <option value=" ">Space ( )</option>
              <option value="">None</option>
            </Select>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <ToggleOption
                id="capitalize-words"
                label="Capitalize words"
                checked={options.capitalizeWords}
                onChange={(checked) => updateOption("capitalizeWords", checked)}
              />
              <ToggleOption
                id="include-number"
                label="Include number"
                checked={options.includeNumber}
                onChange={(checked) => updateOption("includeNumber", checked)}
              />
            </div>
          </>
        )}

        {/* Password Count */}
        <Slider
          id="password-count"
          label={`Generate Multiple: ${options.count}`}
          minLabel="1"
          maxLabel="10"
          min="1"
          max="10"
          value={options.count}
          onChange={(e) => updateOption("count", parseInt(e.target.value))}
        />
      </div>

      {/* Validation Message */}
      {!hasValidOptions && (
        <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-700/50">
          Please select at least one character type to generate a password.
        </div>
      )}

      {/* Generated Passwords */}
      {hasValidOptions && passwords.length > 0 && (
        <div className="space-y-3">
          {passwords.map((password) => (
            <div
              key={password.id}
              className="p-4 space-y-3 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex gap-3 items-center">
                <code className="flex-1 py-3 px-4 font-mono text-sm text-gray-900 break-all bg-gray-50 rounded-lg md:text-base dark:text-white dark:bg-gray-900/50">
                  {password.value}
                </code>
                <Button
                  size="sm"
                  variant={copiedId === password.id ? "primary" : "secondary"}
                  onClick={() => copyPassword(password)}
                  className={clsx(
                    "flex-shrink-0 !p-3",
                    copiedId === password.id &&
                      "bg-green-600 hover:bg-green-600 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-600",
                  )}
                  aria-label={
                    copiedId === password.id ? "Copied!" : "Copy password"
                  }
                >
                  {copiedId === password.id ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <CopyIcon className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Strength Indicator */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <div className="overflow-hidden h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className={clsx(
                        "h-full transition-all duration-300 rounded-full",
                        strengthConfig[password.strength].bgColor,
                        strengthConfig[password.strength].width,
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-2 items-center text-sm">
                  <span className={strengthConfig[password.strength].color}>
                    {strengthConfig[password.strength].label}
                  </span>
                  <span className="text-gray-300 dark:text-gray-500">|</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {password.entropy} bits entropy
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          fullWidth
          onClick={generatePasswords}
          disabled={!hasValidOptions}
          leftIcon={<RefreshIcon className="w-5 h-5" />}
          className="flex-1"
        >
          Generate {options.isPassphrase ? "Passphrase" : "Password"}
          {options.count > 1 ? "s" : ""}
        </Button>

        {passwords.length > 1 && (
          <Button
            size="lg"
            variant={copiedAll ? "primary" : "secondary"}
            onClick={copyAllPasswords}
            className={
              copiedAll
                ? "bg-green-600 hover:bg-green-600 focus:ring-green-500 dark:bg-green-600 dark:hover:bg-green-600"
                : undefined
            }
            leftIcon={
              copiedAll ? (
                <CheckIcon className="w-5 h-5" />
              ) : (
                <CopyIcon className="w-5 h-5" />
              )
            }
          >
            {copiedAll ? "Copied All!" : "Copy All"}
          </Button>
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
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border",
        checked
          ? "bg-blue-50 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700/50"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600/50 dark:hover:bg-gray-700",
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
          "w-5 h-5 rounded flex items-center justify-center transition-all",
          checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600",
        )}
      >
        {checked && <CheckIcon className="w-3 h-3 text-white" />}
      </div>
      <span
        className={clsx(
          "text-sm",
          checked
            ? "text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400",
        )}
      >
        {label}
      </span>
    </label>
  );
}

// Icons
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

export default PasswordGenerator;
