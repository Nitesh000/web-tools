import { useState, useEffect, useCallback, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import clsx from 'clsx';
import {
  useQRCode,
  type QRInputType,
  type ErrorCorrectionLevel,
  type WiFiData,
  type VCardData,
  formatWiFiData,
  formatVCardData,
  formatEmailData,
  formatPhoneData,
} from '../../../hooks/useQRCode';
import { Button } from '../../common/Button';

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorPickerPopover({ color, onChange, label }: ColorPickerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition-colors"
        aria-label={`Select ${label.toLowerCase()}`}
      >
        <span
          className="w-8 h-8 rounded border border-slate-500"
          style={{ backgroundColor: color }}
          aria-hidden="true"
        />
        <span className="text-white font-mono text-sm">{color}</span>
      </button>
      {isOpen && (
        <div className="absolute z-50 top-full mt-2 p-3 bg-slate-800 border border-slate-600 rounded-lg shadow-xl">
          <HexColorPicker color={color} onChange={onChange} />
          <input
            type="text"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="mt-3 w-full p-2 bg-slate-700 border border-slate-600 rounded text-white text-sm font-mono"
            placeholder="#000000"
            aria-label={`${label} hex value`}
          />
        </div>
      )}
    </div>
  );
}

const INPUT_TYPES: { value: QRInputType; label: string; icon: string }[] = [
  { value: 'url', label: 'URL', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { value: 'text', label: 'Text', icon: 'M4 6h16M4 12h16M4 18h7' },
  { value: 'email', label: 'Email', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { value: 'phone', label: 'Phone', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { value: 'wifi', label: 'WiFi', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0' },
  { value: 'vcard', label: 'vCard', icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2' },
];

const ERROR_CORRECTION_LEVELS: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: 'L', label: 'Low (7%)', description: 'Smallest code, least redundancy' },
  { value: 'M', label: 'Medium (15%)', description: 'Good balance of size and reliability' },
  { value: 'Q', label: 'Quartile (25%)', description: 'Higher reliability' },
  { value: 'H', label: 'High (30%)', description: 'Highest reliability, largest code' },
];

export function QRGenerator() {
  const [inputType, setInputType] = useState<QRInputType>('url');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  // Input states for different types
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [emailInput, setEmailInput] = useState({ email: '', subject: '', body: '' });
  const [phoneInput, setPhoneInput] = useState('');
  const [wifiInput, setWifiInput] = useState<WiFiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });
  const [vcardInput, setVcardInput] = useState<VCardData>({
    firstName: '',
    lastName: '',
    organization: '',
    title: '',
    email: '',
    phone: '',
    website: '',
    address: '',
  });

  const {
    dataUrl,
    svgString,
    isGenerating,
    error,
    options,
    logoDataUrl,
    setContent,
    updateOption,
    downloadQRCode,
    copyToClipboard,
    setLogoFromFile,
    getDataUrlWithLogo,
  } = useQRCode();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate content based on input type
  const getFormattedContent = useCallback(() => {
    switch (inputType) {
      case 'url':
        return urlInput;
      case 'text':
        return textInput;
      case 'email':
        return formatEmailData(emailInput.email, emailInput.subject, emailInput.body);
      case 'phone':
        return formatPhoneData(phoneInput);
      case 'wifi':
        return formatWiFiData(wifiInput);
      case 'vcard':
        return formatVCardData(vcardInput);
      default:
        return '';
    }
  }, [inputType, urlInput, textInput, emailInput, phoneInput, wifiInput, vcardInput]);

  // Update QR code content when inputs change
  useEffect(() => {
    const content = getFormattedContent();
    setContent(content);
  }, [getFormattedContent, setContent]);

  // Update preview with logo
  useEffect(() => {
    async function updatePreview() {
      const url = await getDataUrlWithLogo();
      setPreviewUrl(url);
    }
    updatePreview();
  }, [dataUrl, logoDataUrl, getDataUrlWithLogo]);

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setLogoFromFile(file || null);
  };

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const shareUrl = window.location.href;
    const shareText = 'Check out this QR Code Generator!';

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const renderInputFields = () => {
    switch (inputType) {
      case 'url':
        return (
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-2">
              Website URL
            </label>
            <input
              id="url-input"
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'text':
        return (
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-slate-300 mb-2">
              Text Content
            </label>
            <textarea
              id="text-input"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your text here..."
              rows={4}
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                value={emailInput.email}
                onChange={(e) => setEmailInput({ ...emailInput, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email-subject" className="block text-sm font-medium text-slate-300 mb-2">
                Subject (Optional)
              </label>
              <input
                id="email-subject"
                type="text"
                value={emailInput.subject}
                onChange={(e) => setEmailInput({ ...emailInput, subject: e.target.value })}
                placeholder="Email subject"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email-body" className="block text-sm font-medium text-slate-300 mb-2">
                Body (Optional)
              </label>
              <textarea
                id="email-body"
                value={emailInput.body}
                onChange={(e) => setEmailInput({ ...emailInput, body: e.target.value })}
                placeholder="Email body"
                rows={3}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        );

      case 'phone':
        return (
          <div>
            <label htmlFor="phone-input" className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number
            </label>
            <input
              id="phone-input"
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="wifi-ssid" className="block text-sm font-medium text-slate-300 mb-2">
                Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                value={wifiInput.ssid}
                onChange={(e) => setWifiInput({ ...wifiInput, ssid: e.target.value })}
                placeholder="My WiFi Network"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="wifi-password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="wifi-password"
                type="password"
                value={wifiInput.password}
                onChange={(e) => setWifiInput({ ...wifiInput, password: e.target.value })}
                placeholder="Network password"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="wifi-encryption" className="block text-sm font-medium text-slate-300 mb-2">
                Encryption
              </label>
              <select
                id="wifi-encryption"
                value={wifiInput.encryption}
                onChange={(e) => setWifiInput({ ...wifiInput, encryption: e.target.value as WiFiData['encryption'] })}
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="wifi-hidden"
                type="checkbox"
                checked={wifiInput.hidden}
                onChange={(e) => setWifiInput({ ...wifiInput, hidden: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
              />
              <label htmlFor="wifi-hidden" className="text-sm text-slate-300">
                Hidden Network
              </label>
            </div>
          </div>
        );

      case 'vcard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vcard-firstname" className="block text-sm font-medium text-slate-300 mb-2">
                  First Name *
                </label>
                <input
                  id="vcard-firstname"
                  type="text"
                  value={vcardInput.firstName}
                  onChange={(e) => setVcardInput({ ...vcardInput, firstName: e.target.value })}
                  placeholder="John"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="vcard-lastname" className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name *
                </label>
                <input
                  id="vcard-lastname"
                  type="text"
                  value={vcardInput.lastName}
                  onChange={(e) => setVcardInput({ ...vcardInput, lastName: e.target.value })}
                  placeholder="Doe"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vcard-org" className="block text-sm font-medium text-slate-300 mb-2">
                  Organization
                </label>
                <input
                  id="vcard-org"
                  type="text"
                  value={vcardInput.organization}
                  onChange={(e) => setVcardInput({ ...vcardInput, organization: e.target.value })}
                  placeholder="Company Inc."
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="vcard-title" className="block text-sm font-medium text-slate-300 mb-2">
                  Job Title
                </label>
                <input
                  id="vcard-title"
                  type="text"
                  value={vcardInput.title}
                  onChange={(e) => setVcardInput({ ...vcardInput, title: e.target.value })}
                  placeholder="Software Engineer"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vcard-email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  id="vcard-email"
                  type="email"
                  value={vcardInput.email}
                  onChange={(e) => setVcardInput({ ...vcardInput, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="vcard-phone" className="block text-sm font-medium text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  id="vcard-phone"
                  type="tel"
                  value={vcardInput.phone}
                  onChange={(e) => setVcardInput({ ...vcardInput, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="vcard-website" className="block text-sm font-medium text-slate-300 mb-2">
                Website
              </label>
              <input
                id="vcard-website"
                type="url"
                value={vcardInput.website}
                onChange={(e) => setVcardInput({ ...vcardInput, website: e.target.value })}
                placeholder="https://example.com"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="vcard-address" className="block text-sm font-medium text-slate-300 mb-2">
                Address
              </label>
              <input
                id="vcard-address"
                type="text"
                value={vcardInput.address}
                onChange={(e) => setVcardInput({ ...vcardInput, address: e.target.value })}
                placeholder="123 Main St, City, Country"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="space-y-6">
        {/* Input Type Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            QR Code Type
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" role="radiogroup" aria-label="QR code type">
            {INPUT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                role="radio"
                aria-checked={inputType === type.value}
                onClick={() => setInputType(type.value)}
                className={clsx(
                  'flex flex-col items-center gap-1 p-3 rounded-lg border transition-all',
                  inputType === type.value
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
                )}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={type.icon}
                  />
                </svg>
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Input Fields */}
        <div className="bg-slate-700/30 rounded-xl p-4">
          {renderInputFields()}
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          aria-expanded={showAdvanced}
        >
          <svg
            className={clsx('w-4 h-4 transition-transform', showAdvanced && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          Advanced Options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-6 bg-slate-700/30 rounded-xl p-4 animate-in slide-in-from-top-2">
            {/* Size Slider */}
            <div>
              <label htmlFor="qr-size" className="block text-sm font-medium text-slate-300 mb-2">
                Size: {options.size}px
              </label>
              <input
                id="qr-size"
                type="range"
                min="100"
                max="1000"
                step="10"
                value={options.size}
                onChange={(e) => updateOption('size', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>100px</span>
                <span>1000px</span>
              </div>
            </div>

            {/* Error Correction Level */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Error Correction Level
              </label>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Error correction level">
                {ERROR_CORRECTION_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    role="radio"
                    aria-checked={options.errorCorrectionLevel === level.value}
                    onClick={() => updateOption('errorCorrectionLevel', level.value)}
                    className={clsx(
                      'p-3 rounded-lg border text-left transition-all',
                      options.errorCorrectionLevel === level.value
                        ? 'bg-blue-600 border-blue-500'
                        : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700'
                    )}
                  >
                    <div className="text-sm font-medium text-white">{level.label}</div>
                    <div className="text-xs text-slate-400">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPickerPopover
                color={options.foregroundColor}
                onChange={(color) => updateOption('foregroundColor', color)}
                label="Foreground Color"
              />
              <ColorPickerPopover
                color={options.backgroundColor}
                onChange={(color) => updateOption('backgroundColor', color)}
                label="Background Color"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Center Logo (Optional)
              </label>
              <p className="text-xs text-slate-400 mb-3">
                For best results with a logo, use High error correction level.
              </p>
              <div className="flex items-center gap-4">
                <label
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                    logoDataUrl
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                  )}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="sr-only"
                    aria-label="Upload logo image"
                  />
                  {logoDataUrl ? (
                    <>
                      <img
                        src={logoDataUrl}
                        alt="Logo preview"
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-green-400 text-sm">Logo uploaded</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-6 h-6 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-slate-400 text-sm">Upload logo</span>
                    </>
                  )}
                </label>
                {logoDataUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLogoFromFile(null)}
                    aria-label="Remove logo"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="space-y-6">
        <div className="bg-slate-700/30 rounded-xl p-6 flex flex-col items-center">
          <h3 className="text-lg font-medium text-white mb-4">Preview</h3>

          {/* QR Code Preview */}
          <div
            className="relative bg-white rounded-lg p-4 shadow-lg"
            style={{ maxWidth: Math.min(options.size, 400) }}
          >
            {isGenerating ? (
              <div className="flex items-center justify-center w-64 h-64">
                <svg
                  className="w-8 h-8 animate-spin text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="sr-only">Generating QR code...</span>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Generated QR Code"
                className="w-full h-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-64 h-64 text-slate-400">
                <svg
                  className="w-16 h-16 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
                <p className="text-sm">Enter content to generate QR code</p>
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 text-red-400 text-sm" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            variant="primary"
            onClick={() => downloadQRCode('png')}
            disabled={!previewUrl || isGenerating}
            fullWidth
          >
            PNG
          </Button>
          <Button
            variant="primary"
            onClick={() => downloadQRCode('svg')}
            disabled={!svgString || isGenerating}
            fullWidth
          >
            SVG
          </Button>
          <Button
            variant="primary"
            onClick={() => downloadQRCode('jpeg')}
            disabled={!previewUrl || isGenerating}
            fullWidth
          >
            JPEG
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopy}
            disabled={!previewUrl || isGenerating}
            fullWidth
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        {/* Share Buttons */}
        <div>
          <p className="text-sm text-slate-400 mb-3">Share this tool:</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleShare('twitter')}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Share on Twitter"
            >
              <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleShare('facebook')}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Share on Facebook"
            >
              <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleShare('linkedin')}
              className="p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-slate-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;
