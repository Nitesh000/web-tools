import { ToolLayout } from '../components/common/ToolLayout';
import { PasswordGenerator } from '../components/tools/password-generator/PasswordGenerator';

const seoMeta = {
  title: 'Password Generator - Free Secure Password Creator Online | Web Tools Suite',
  description:
    'Generate strong, secure passwords instantly with our free online password generator. Customize length, characters, and complexity. Create passwords or passphrases with cryptographically secure randomness.',
  keywords: [
    'password generator',
    'strong password',
    'secure password',
    'random password',
    'password creator',
    'free password generator',
    'online password generator',
    'generate password',
    'safe password',
    'complex password',
    'passphrase generator',
    'cryptographic password',
    'password strength',
    'entropy calculator',
  ],
  canonicalUrl: 'https://webtools.suite/password-generator',
};

const howToUseSteps = [
  'Choose between Password mode (random characters) or Passphrase mode (random words) using the toggle at the top.',
  'For passwords: Adjust the length slider to set your desired password length (8-128 characters recommended minimum of 12).',
  'Select which character types to include: uppercase letters, lowercase letters, numbers, and symbols.',
  'Optionally exclude ambiguous characters (like 0, O, l, 1, I) or similar-looking symbols for easier reading.',
  'For passphrases: Set the number of words (3-10), choose a separator, and decide whether to capitalize words or include numbers.',
  'Use the "Generate Multiple" slider to create up to 10 passwords at once for comparison.',
  'Review the strength indicator and entropy bits for each generated password.',
  'Click the copy button next to any password to copy it to your clipboard.',
  'Click "Generate Password" to create new passwords with your current settings.',
];

const faqs = [
  {
    question: 'How secure are the generated passwords?',
    answer:
      'Our passwords are generated using the Web Crypto API (crypto.getRandomValues), which provides cryptographically secure random numbers. This is the same level of randomness used by security professionals and is far superior to Math.random(). The passwords are generated entirely in your browser and are never transmitted or stored anywhere.',
  },
  {
    question: 'What makes a strong password?',
    answer:
      'A strong password has three main characteristics: sufficient length (at least 12-16 characters), character variety (uppercase, lowercase, numbers, and symbols), and true randomness (not based on dictionary words or patterns). Our generator creates passwords meeting all these criteria, with entropy levels clearly displayed so you can verify strength.',
  },
  {
    question: 'What is password entropy?',
    answer:
      'Entropy measures password strength in bits. Higher entropy means more possible combinations and harder to crack. A password with 60 bits of entropy has 2^60 possible combinations. General guidelines: under 28 bits is very weak, 28-35 bits is weak, 36-59 bits is fair, 60-127 bits is strong, and 128+ bits is very strong.',
  },
  {
    question: 'Should I use a password or passphrase?',
    answer:
      'Both can be secure if properly generated. Passwords are shorter but harder to remember. Passphrases (like "Maple-River-Storm-42") are longer but easier to remember and type. A 4-word passphrase from our 100-word list has about 26 bits of entropy per word. For maximum security with memorability, use 5-6 word passphrases.',
  },
  {
    question: 'Why exclude ambiguous or similar characters?',
    answer:
      'Ambiguous characters (0, O, l, 1, I) look nearly identical in many fonts, causing confusion when reading or typing passwords. Similar characters (brackets, quotes, etc.) can cause issues in some systems or when passwords are shared verbally. Excluding them slightly reduces entropy but significantly improves usability.',
  },
  {
    question: 'Are my generated passwords saved anywhere?',
    answer:
      'No. Passwords are generated locally in your browser using JavaScript and are never sent to any server. We have no way to see, store, or recover your generated passwords. Once you close or refresh the page, the passwords exist only if you have saved them elsewhere.',
  },
  {
    question: 'How often should I change my passwords?',
    answer:
      'Modern security guidance from NIST no longer recommends regular password changes unless there is evidence of compromise. Instead, focus on using unique, strong passwords for each account and enabling two-factor authentication where available. Use a password manager to keep track of all your unique passwords.',
  },
  {
    question: 'What is the recommended password length?',
    answer:
      'We recommend a minimum of 12 characters for important accounts, 16+ characters for highly sensitive accounts (banking, email), and consider passphrases for accounts you need to type frequently. With our generator, longer passwords cost nothing extra in terms of effort, so err on the side of longer.',
  },
];

const relatedTools = [
  {
    name: 'QR Code Generator',
    href: '/qr-generator',
    description: 'Generate QR codes for URLs, text, and more',
  },
  {
    name: 'Text Case Converter',
    href: '/text-case-converter',
    description: 'Convert text between different cases',
  },
  {
    name: 'JSON Formatter',
    href: '/json-formatter',
    description: 'Format, validate, and beautify JSON data',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Pick and convert colors between formats',
  },
  {
    name: 'Invoice Generator',
    href: '/invoice-generator',
    description: 'Create professional invoices instantly',
  },
  {
    name: 'Image Compressor',
    href: '/image-compressor',
    description: 'Compress images without losing quality',
  },
];

const seoDescription = `
In today's digital world, strong passwords are your first line of defense against unauthorized access to your accounts, data, and identity. With data breaches exposing billions of credentials and sophisticated attacks becoming more common, using unique, randomly generated passwords for every account is no longer optional - it is essential.

Our free online Password Generator creates cryptographically secure passwords directly in your browser. Whether you need a complex random password or an easy-to-remember passphrase, our tool provides flexible options to meet your security needs while maintaining complete privacy.

Understanding Password Security

Password strength is measured in entropy, which represents the number of possible combinations an attacker would need to try. A password with 60 bits of entropy means there are 2^60 (about 1 quintillion) possible combinations. Modern computers can test billions of passwords per second, so high entropy is crucial.

The three factors that determine password strength are length, character variety, and randomness. Length has the biggest impact - each additional character exponentially increases the number of possible combinations. Character variety (using uppercase, lowercase, numbers, and symbols) increases the pool of possible characters for each position. True randomness ensures that attackers cannot use shortcuts like dictionary attacks or pattern recognition.

Password vs Passphrase

Traditional passwords use random characters and are highly secure but difficult to remember. A 16-character password with all character types has about 105 bits of entropy - practically uncrackable by brute force.

Passphrases use random words separated by a character. They are longer but easier to remember and type. A passphrase like "Maple-River-Storm-Eagle-42" is both secure and memorable. Our generator uses a curated list of 100 common words, giving about 6.6 bits of entropy per word plus additional entropy from capitalization, separators, and optional numbers.

For most users, we recommend passphrases for accounts you need to type frequently (like your computer login) and random passwords for accounts where you will use a password manager.

Cryptographic Security

Our generator uses the Web Crypto API's crypto.getRandomValues() function, which provides cryptographically secure pseudo-random numbers. This is fundamentally different from Math.random(), which is predictable and should never be used for security purposes.

Cryptographically secure random number generators (CSPRNGs) are designed to be unpredictable even if an attacker knows the algorithm. They use entropy from your operating system (mouse movements, keyboard timing, hardware events) to seed the random number generator, ensuring true randomness.

Character Type Recommendations

Uppercase letters (A-Z) provide 26 possible characters and are required by many password policies. Lowercase letters (a-z) provide another 26 characters and are essential for case-sensitive systems. Numbers (0-9) provide 10 characters and are often required. Symbols (!@#$%^&*...) provide 20+ characters and significantly increase entropy but may cause issues in some systems.

For maximum compatibility, we recommend at least uppercase, lowercase, and numbers. Add symbols for sensitive accounts unless you know the system has restrictions on special characters.

The option to exclude ambiguous characters (0, O, l, 1, I) removes characters that look similar in many fonts, reducing frustration when reading or typing passwords. The option to exclude similar characters removes brackets and quotes that can cause parsing issues in some applications.

Best Practices for Password Management

Use unique passwords for every account - if one service is breached, your other accounts remain secure. Use a reputable password manager to store your passwords securely. Enable two-factor authentication (2FA) wherever available. Never share passwords via email, text, or chat. Never reuse passwords, even variations of the same base password.

For your password manager's master password, use a strong passphrase that you can memorize. This is the one password you must remember, so make it both secure and memorable.

Privacy Guarantee

All password generation happens locally in your browser using JavaScript. Your passwords are never transmitted over the network, stored in cookies or local storage, logged in any way, or visible to us or anyone else.

When you close or refresh the page, the generated passwords are immediately cleared from memory. The only copy of your password is the one you manually save or copy.

This browser-based approach also means the generator works offline once the page is loaded, and there are no rate limits or usage restrictions. Generate as many passwords as you need, as often as you need them.

Technical Implementation

Our generator calculates entropy based on the actual character set used and password length. The formula is: entropy = length * log2(charsetSize). This gives you an accurate measure of password strength regardless of the specific characters generated.

The strength indicator uses industry-standard thresholds: under 28 bits is very weak (crackable in seconds), 28-35 bits is weak (crackable in minutes to hours), 36-59 bits is fair (crackable in days to years), 60-127 bits is strong (practically uncrackable with current technology), and 128+ bits is very strong (secure against quantum computers).

For passphrases, entropy is calculated based on the word list size, number of words, and additional options like numbers and capitalization.
`.trim();

export function PasswordGeneratorPage() {
  return (
    <ToolLayout
      seo={seoMeta}
      title="Password Generator"
      description={seoDescription}
      howToUse={howToUseSteps}
      faqs={faqs}
      relatedTools={relatedTools}
      privacyNote="All processing happens locally in your browser"
    >
      <PasswordGenerator />
    </ToolLayout>
  );
}

export default PasswordGeneratorPage;
