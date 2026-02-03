import { useState, useCallback, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export type QRInputType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface QRCodeOptions {
  size: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  foregroundColor: string;
  backgroundColor: string;
  margin: number;
}

export interface QRCodeState {
  dataUrl: string | null;
  svgString: string | null;
  isGenerating: boolean;
  error: string | null;
}

const defaultOptions: QRCodeOptions = {
  size: 300,
  errorCorrectionLevel: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  margin: 2,
};

/**
 * Formats WiFi data into the standard WiFi QR code format
 */
export function formatWiFiData(wifi: WiFiData): string {
  const escapedSSID = wifi.ssid.replace(/[\\;,:]/g, '\\$&');
  const escapedPassword = wifi.password.replace(/[\\;,:]/g, '\\$&');

  return `WIFI:T:${wifi.encryption};S:${escapedSSID};P:${escapedPassword};H:${wifi.hidden ? 'true' : 'false'};;`;
}

/**
 * Formats vCard data into the vCard 3.0 format
 */
export function formatVCardData(vcard: VCardData): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${vcard.lastName};${vcard.firstName};;;`,
    `FN:${vcard.firstName} ${vcard.lastName}`,
  ];

  if (vcard.organization) {
    lines.push(`ORG:${vcard.organization}`);
  }
  if (vcard.title) {
    lines.push(`TITLE:${vcard.title}`);
  }
  if (vcard.email) {
    lines.push(`EMAIL:${vcard.email}`);
  }
  if (vcard.phone) {
    lines.push(`TEL:${vcard.phone}`);
  }
  if (vcard.website) {
    lines.push(`URL:${vcard.website}`);
  }
  if (vcard.address) {
    lines.push(`ADR:;;${vcard.address};;;;`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Formats email data into mailto: format
 */
export function formatEmailData(email: string, subject?: string, body?: string): string {
  let mailto = `mailto:${email}`;
  const params: string[] = [];

  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }

  if (params.length > 0) {
    mailto += '?' + params.join('&');
  }

  return mailto;
}

/**
 * Formats phone data into tel: format
 */
export function formatPhoneData(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, '')}`;
}

/**
 * Hook for generating QR codes with various options
 */
export function useQRCode(initialOptions: Partial<QRCodeOptions> = {}) {
  const [options, setOptions] = useState<QRCodeOptions>({
    ...defaultOptions,
    ...initialOptions,
  });

  const [state, setState] = useState<QRCodeState>({
    dataUrl: null,
    svgString: null,
    isGenerating: false,
    error: null,
  });

  const [content, setContent] = useState<string>('');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * Generates a QR code from the given content
   */
  const generateQRCode = useCallback(async (text: string) => {
    if (!text.trim()) {
      setState({
        dataUrl: null,
        svgString: null,
        isGenerating: false,
        error: null,
      });
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      // Generate PNG data URL
      const qrOptions: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: options.errorCorrectionLevel,
        type: 'image/png',
        width: options.size,
        margin: options.margin,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor,
        },
      };

      const dataUrl = await QRCode.toDataURL(text, qrOptions);

      // Generate SVG string
      const svgOptions: QRCode.QRCodeToStringOptions = {
        errorCorrectionLevel: options.errorCorrectionLevel,
        type: 'svg',
        width: options.size,
        margin: options.margin,
        color: {
          dark: options.foregroundColor,
          light: options.backgroundColor,
        },
      };

      const svgString = await QRCode.toString(text, svgOptions);

      setState({
        dataUrl,
        svgString,
        isGenerating: false,
        error: null,
      });
    } catch (error) {
      setState({
        dataUrl: null,
        svgString: null,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Failed to generate QR code',
      });
    }
  }, [options]);

  /**
   * Update a single option
   */
  const updateOption = useCallback(<K extends keyof QRCodeOptions>(
    key: K,
    value: QRCodeOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  /**
   * Reset options to defaults
   */
  const resetOptions = useCallback(() => {
    setOptions(defaultOptions);
  }, []);

  /**
   * Download QR code as specified format
   */
  const downloadQRCode = useCallback(async (
    format: 'png' | 'svg' | 'jpeg',
    filename: string = 'qrcode'
  ) => {
    if (!content.trim()) return;

    try {
      let blob: Blob;
      let extension: string;

      if (format === 'svg') {
        if (!state.svgString) return;
        blob = new Blob([state.svgString], { type: 'image/svg+xml' });
        extension = 'svg';
      } else {
        // For PNG and JPEG, we need to create a canvas with the logo if present
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        canvas.width = options.size;
        canvas.height = options.size;

        // Generate base QR code
        const qrCanvas = document.createElement('canvas');
        await QRCode.toCanvas(qrCanvas, content, {
          errorCorrectionLevel: options.errorCorrectionLevel,
          width: options.size,
          margin: options.margin,
          color: {
            dark: options.foregroundColor,
            light: options.backgroundColor,
          },
        });

        // Draw QR code
        ctx.drawImage(qrCanvas, 0, 0);

        // Draw logo if present
        if (logoDataUrl) {
          const logoImg = new Image();
          await new Promise<void>((resolve, reject) => {
            logoImg.onload = () => resolve();
            logoImg.onerror = reject;
            logoImg.src = logoDataUrl;
          });

          const logoSize = options.size * 0.2;
          const logoX = (options.size - logoSize) / 2;
          const logoY = (options.size - logoSize) / 2;

          // Draw white background for logo
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

          // Draw logo
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        }

        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const quality = format === 'jpeg' ? 0.95 : undefined;

        blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => b ? resolve(b) : reject(new Error('Failed to create blob')),
            mimeType,
            quality
          );
        });
        extension = format;
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download QR code:', error);
      throw error;
    }
  }, [content, state.svgString, options, logoDataUrl]);

  /**
   * Copy QR code image to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    if (!state.dataUrl) return false;

    try {
      // Fetch the data URL as a blob
      const response = await fetch(state.dataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  }, [state.dataUrl]);

  /**
   * Get data URL for current QR code (with logo if present)
   */
  const getDataUrlWithLogo = useCallback(async (): Promise<string | null> => {
    if (!content.trim() || !state.dataUrl) return state.dataUrl;

    if (!logoDataUrl) return state.dataUrl;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return state.dataUrl;

      canvas.width = options.size;
      canvas.height = options.size;

      // Load QR code image
      const qrImg = new Image();
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = reject;
        qrImg.src = state.dataUrl!;
      });

      ctx.drawImage(qrImg, 0, 0, options.size, options.size);

      // Load and draw logo
      const logoImg = new Image();
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = reject;
        logoImg.src = logoDataUrl;
      });

      const logoSize = options.size * 0.2;
      const logoX = (options.size - logoSize) / 2;
      const logoY = (options.size - logoSize) / 2;

      // Draw white background for logo
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

      // Draw logo
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Failed to add logo:', error);
      return state.dataUrl;
    }
  }, [content, state.dataUrl, logoDataUrl, options]);

  /**
   * Set logo from file
   */
  const setLogoFromFile = useCallback((file: File | null) => {
    if (!file) {
      setLogoDataUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Regenerate QR code when content or options change
  useEffect(() => {
    generateQRCode(content);
  }, [content, generateQRCode]);

  return {
    // State
    ...state,
    content,
    options,
    logoDataUrl,
    canvasRef,

    // Actions
    setContent,
    setOptions,
    updateOption,
    resetOptions,
    generateQRCode,
    downloadQRCode,
    copyToClipboard,
    getDataUrlWithLogo,
    setLogoFromFile,
    setLogoDataUrl,
  };
}

export default useQRCode;
