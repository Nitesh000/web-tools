import { useState, useEffect, useCallback, useRef, useId } from 'react';
import clsx from 'clsx';

// Types
interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  logo: string | null;
}

interface ClientInfo {
  name: string;
  address: string;
  email: string;
}

interface InvoiceData {
  companyInfo: CompanyInfo;
  clientInfo: ClientInfo;
  invoiceNumber: string;
  invoicePrefix: string;
  invoiceDate: string;
  dueDate: string;
  lineItems: LineItem[];
  taxRate: number;
  discount: number;
  notes: string;
  paymentDetails: string;
  currency: string;
  template: TemplateType;
}

type TemplateType = 'modern' | 'classic' | 'minimal';

const CURRENCY_OPTIONS = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '\u20ac', name: 'Euro' },
  { code: 'GBP', symbol: '\u00a3', name: 'British Pound' },
  { code: 'JPY', symbol: '\u00a5', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '\u00a5', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '\u20b9', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

const STORAGE_KEY = 'invoice-generator-draft';

const generateInvoiceNumber = (prefix: string): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

const getDefaultDueDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split('T')[0];
};

const createEmptyLineItem = (): LineItem => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: 1,
  unitPrice: 0,
});

const getInitialData = (): InvoiceData => ({
  companyInfo: {
    name: '',
    address: '',
    logo: null,
  },
  clientInfo: {
    name: '',
    address: '',
    email: '',
  },
  invoiceNumber: '',
  invoicePrefix: 'INV-',
  invoiceDate: getTodayDate(),
  dueDate: getDefaultDueDate(),
  lineItems: [createEmptyLineItem()],
  taxRate: 0,
  discount: 0,
  notes: '',
  paymentDetails: '',
  currency: 'USD',
  template: 'modern',
});

export function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(() => {
    if (typeof window === 'undefined') return getInitialData();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...getInitialData(), ...parsed };
      } catch {
        return getInitialData();
      }
    }
    return getInitialData();
  });

  const [showPreview, setShowPreview] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();

  // Generate invoice number on first load if empty
  useEffect(() => {
    if (!data.invoiceNumber) {
      setData(prev => ({
        ...prev,
        invoiceNumber: generateInvoiceNumber(prev.invoicePrefix),
      }));
    }
  }, [data.invoiceNumber]);

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [data]);

  const getCurrencySymbol = useCallback(() => {
    return CURRENCY_OPTIONS.find(c => c.code === data.currency)?.symbol || '$';
  }, [data.currency]);

  const formatCurrency = useCallback((amount: number): string => {
    const symbol = getCurrencySymbol();
    return `${symbol}${amount.toFixed(2)}`;
  }, [getCurrencySymbol]);

  const calculateSubtotal = useCallback((): number => {
    return data.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [data.lineItems]);

  const calculateTax = useCallback((): number => {
    const subtotal = calculateSubtotal();
    return subtotal * (data.taxRate / 100);
  }, [calculateSubtotal, data.taxRate]);

  const calculateTotal = useCallback((): number => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    return subtotal + tax - data.discount;
  }, [calculateSubtotal, calculateTax, data.discount]);

  const updateCompanyInfo = (field: keyof CompanyInfo, value: string | null) => {
    setData(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, [field]: value },
    }));
  };

  const updateClientInfo = (field: keyof ClientInfo, value: string) => {
    setData(prev => ({
      ...prev,
      clientInfo: { ...prev.clientInfo, [field]: value },
    }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addLineItem = () => {
    setData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, createEmptyLineItem()],
    }));
  };

  const removeLineItem = (id: string) => {
    if (data.lineItems.length <= 1) return;
    setData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCompanyInfo('logo', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const regenerateInvoiceNumber = () => {
    setData(prev => ({
      ...prev,
      invoiceNumber: generateInvoiceNumber(prev.invoicePrefix),
    }));
  };

  const handlePrefixChange = (prefix: string) => {
    setData(prev => ({
      ...prev,
      invoicePrefix: prefix,
      invoiceNumber: generateInvoiceNumber(prefix),
    }));
  };

  const clearDraft = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setData(getInitialData());
  };

  const handlePrint = () => {
    window.print();
  };

  const inputClasses = clsx(
    'w-full px-3 py-2 rounded-lg',
    'bg-slate-700/50 border border-slate-600/50',
    'text-white placeholder-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    'transition-colors'
  );

  const labelClasses = 'block text-sm font-medium text-slate-300 mb-1';

  const buttonClasses = clsx(
    'px-4 py-2 rounded-lg font-medium',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800'
  );

  // Template-specific styles for the invoice preview
  const getTemplateStyles = () => {
    switch (data.template) {
      case 'classic':
        return {
          container: 'bg-white text-gray-900 font-serif',
          header: 'border-b-4 border-gray-800',
          accent: 'text-gray-800',
          table: 'border border-gray-300',
          tableHeader: 'bg-gray-100 border-b-2 border-gray-800',
          tableRow: 'border-b border-gray-200',
        };
      case 'minimal':
        return {
          container: 'bg-white text-gray-700 font-sans',
          header: 'border-b border-gray-200',
          accent: 'text-gray-600',
          table: '',
          tableHeader: 'border-b border-gray-300 text-gray-500 uppercase text-xs tracking-wider',
          tableRow: 'border-b border-gray-100',
        };
      case 'modern':
      default:
        return {
          container: 'bg-white text-gray-900 font-sans',
          header: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg',
          accent: 'text-blue-600',
          table: 'rounded-lg overflow-hidden',
          tableHeader: 'bg-blue-50 text-blue-800',
          tableRow: 'border-b border-gray-100 hover:bg-gray-50',
        };
    }
  };

  const templateStyles = getTemplateStyles();

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={clsx(buttonClasses, 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500')}
          >
            {showPreview ? 'Edit Invoice' : 'Preview Invoice'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className={clsx(buttonClasses, 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500')}
          >
            Download PDF
          </button>
        </div>
        <div className="flex items-center gap-3">
          {draftSaved && (
            <span className="text-green-400 text-sm">Draft saved</span>
          )}
          <button
            type="button"
            onClick={clearDraft}
            className={clsx(buttonClasses, 'bg-red-600/20 hover:bg-red-600/30 text-red-400 focus:ring-red-500')}
          >
            Clear Draft
          </button>
        </div>
      </div>

      <div className={clsx('grid gap-6', showPreview ? 'lg:grid-cols-1' : 'lg:grid-cols-2')}>
        {/* Form Section */}
        {!showPreview && (
          <div className="space-y-6">
            {/* Template & Currency Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`${formId}-template`} className={labelClasses}>
                  Template Style
                </label>
                <select
                  id={`${formId}-template`}
                  value={data.template}
                  onChange={(e) => setData(prev => ({ ...prev, template: e.target.value as TemplateType }))}
                  className={inputClasses}
                >
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              <div>
                <label htmlFor={`${formId}-currency`} className={labelClasses}>
                  Currency
                </label>
                <select
                  id={`${formId}-currency`}
                  value={data.currency}
                  onChange={(e) => setData(prev => ({ ...prev, currency: e.target.value }))}
                  className={inputClasses}
                >
                  {CURRENCY_OPTIONS.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Company Information */}
            <fieldset className="border border-slate-600/50 rounded-lg p-4">
              <legend className="text-white font-medium px-2">Your Company Information</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor={`${formId}-company-name`} className={labelClasses}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    id={`${formId}-company-name`}
                    value={data.companyInfo.name}
                    onChange={(e) => updateCompanyInfo('name', e.target.value)}
                    placeholder="Your Company Name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-company-address`} className={labelClasses}>
                    Address
                  </label>
                  <textarea
                    id={`${formId}-company-address`}
                    value={data.companyInfo.address}
                    onChange={(e) => updateCompanyInfo('address', e.target.value)}
                    placeholder="123 Business St&#10;City, State 12345"
                    rows={3}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Company Logo</label>
                  <div className="flex items-center gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      aria-label="Upload company logo"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={clsx(buttonClasses, 'bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-400')}
                    >
                      Upload Logo
                    </button>
                    {data.companyInfo.logo && (
                      <div className="flex items-center gap-2">
                        <img
                          src={data.companyInfo.logo}
                          alt="Company logo preview"
                          className="h-10 w-auto object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => updateCompanyInfo('logo', null)}
                          className="text-red-400 hover:text-red-300"
                          aria-label="Remove logo"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Client Information */}
            <fieldset className="border border-slate-600/50 rounded-lg p-4">
              <legend className="text-white font-medium px-2">Client Information</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor={`${formId}-client-name`} className={labelClasses}>
                    Client Name
                  </label>
                  <input
                    type="text"
                    id={`${formId}-client-name`}
                    value={data.clientInfo.name}
                    onChange={(e) => updateClientInfo('name', e.target.value)}
                    placeholder="Client Name or Company"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-client-address`} className={labelClasses}>
                    Address
                  </label>
                  <textarea
                    id={`${formId}-client-address`}
                    value={data.clientInfo.address}
                    onChange={(e) => updateClientInfo('address', e.target.value)}
                    placeholder="Client Address"
                    rows={3}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-client-email`} className={labelClasses}>
                    Email
                  </label>
                  <input
                    type="email"
                    id={`${formId}-client-email`}
                    value={data.clientInfo.email}
                    onChange={(e) => updateClientInfo('email', e.target.value)}
                    placeholder="client@example.com"
                    className={inputClasses}
                  />
                </div>
              </div>
            </fieldset>

            {/* Invoice Details */}
            <fieldset className="border border-slate-600/50 rounded-lg p-4">
              <legend className="text-white font-medium px-2">Invoice Details</legend>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-invoice-prefix`} className={labelClasses}>
                      Invoice Prefix
                    </label>
                    <input
                      type="text"
                      id={`${formId}-invoice-prefix`}
                      value={data.invoicePrefix}
                      onChange={(e) => handlePrefixChange(e.target.value)}
                      placeholder="INV-"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-invoice-number`} className={labelClasses}>
                      Invoice Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id={`${formId}-invoice-number`}
                        value={data.invoiceNumber}
                        onChange={(e) => setData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                        className={clsx(inputClasses, 'flex-1')}
                      />
                      <button
                        type="button"
                        onClick={regenerateInvoiceNumber}
                        className={clsx(buttonClasses, 'bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-400')}
                        aria-label="Regenerate invoice number"
                        title="Regenerate invoice number"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-invoice-date`} className={labelClasses}>
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      id={`${formId}-invoice-date`}
                      value={data.invoiceDate}
                      onChange={(e) => setData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-due-date`} className={labelClasses}>
                      Due Date
                    </label>
                    <input
                      type="date"
                      id={`${formId}-due-date`}
                      value={data.dueDate}
                      onChange={(e) => setData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Line Items */}
            <fieldset className="border border-slate-600/50 rounded-lg p-4">
              <legend className="text-white font-medium px-2">Line Items</legend>
              <div className="space-y-4">
                <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-sm font-medium text-slate-400">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Total</div>
                  <div className="col-span-1"></div>
                </div>
                {data.lineItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
                    <div className="sm:col-span-5">
                      <label htmlFor={`${formId}-item-desc-${index}`} className="sr-only">
                        Item description
                      </label>
                      <input
                        type="text"
                        id={`${formId}-item-desc-${index}`}
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                        placeholder="Item description"
                        className={inputClasses}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`${formId}-item-qty-${index}`} className="sr-only">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id={`${formId}-item-qty-${index}`}
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                        className={inputClasses}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={`${formId}-item-price-${index}`} className="sr-only">
                        Unit price
                      </label>
                      <input
                        type="number"
                        id={`${formId}-item-price-${index}`}
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={inputClasses}
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center h-10 text-slate-300">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </div>
                    <div className="sm:col-span-1 flex items-center">
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        disabled={data.lineItems.length <= 1}
                        className={clsx(
                          'p-2 rounded-lg transition-colors',
                          data.lineItems.length <= 1
                            ? 'text-slate-500 cursor-not-allowed'
                            : 'text-red-400 hover:bg-red-600/20'
                        )}
                        aria-label="Remove line item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLineItem}
                  className={clsx(buttonClasses, 'w-full bg-slate-600/50 hover:bg-slate-600 text-white focus:ring-slate-400')}
                >
                  + Add Line Item
                </button>
              </div>
            </fieldset>

            {/* Totals */}
            <fieldset className="border border-slate-600/50 rounded-lg p-4">
              <legend className="text-white font-medium px-2">Totals</legend>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`${formId}-tax-rate`} className={labelClasses}>
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id={`${formId}-tax-rate`}
                      value={data.taxRate}
                      onChange={(e) => setData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      max="100"
                      step="0.1"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-discount`} className={labelClasses}>
                      Discount ({getCurrencySymbol()})
                    </label>
                    <input
                      type="number"
                      id={`${formId}-discount`}
                      value={data.discount}
                      onChange={(e) => setData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      step="0.01"
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  {data.taxRate > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Tax ({data.taxRate}%):</span>
                      <span>{formatCurrency(calculateTax())}</span>
                    </div>
                  )}
                  {data.discount > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Discount:</span>
                      <span>-{formatCurrency(data.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold text-lg border-t border-slate-600 pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Notes & Payment */}
            <fieldset className="border border-slate-600/50 rounded-lg p-4">
              <legend className="text-white font-medium px-2">Notes & Payment</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor={`${formId}-notes`} className={labelClasses}>
                    Notes / Terms
                  </label>
                  <textarea
                    id={`${formId}-notes`}
                    value={data.notes}
                    onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Payment terms, thank you message, etc."
                    rows={3}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-payment`} className={labelClasses}>
                    Payment Details
                  </label>
                  <textarea
                    id={`${formId}-payment`}
                    value={data.paymentDetails}
                    onChange={(e) => setData(prev => ({ ...prev, paymentDetails: e.target.value }))}
                    placeholder="Bank name, account number, PayPal, etc."
                    rows={3}
                    className={inputClasses}
                  />
                </div>
              </div>
            </fieldset>
          </div>
        )}

        {/* Preview Section */}
        <div className={clsx(showPreview ? 'block' : 'hidden lg:block')}>
          <div className="sticky top-4">
            <h3 className="text-lg font-medium text-white mb-4 print:hidden">Invoice Preview</h3>
            <div
              ref={printRef}
              className={clsx(
                'invoice-preview',
                templateStyles.container,
                'p-8 rounded-lg shadow-xl max-w-2xl mx-auto'
              )}
            >
              {/* Invoice Header */}
              <div className={clsx('p-6 -m-8 mb-8', templateStyles.header)}>
                <div className="flex justify-between items-start">
                  <div>
                    {data.companyInfo.logo && (
                      <img
                        src={data.companyInfo.logo}
                        alt="Company logo"
                        className="h-16 w-auto object-contain mb-4"
                      />
                    )}
                    <h1 className={clsx('text-2xl font-bold', data.template === 'modern' ? 'text-white' : templateStyles.accent)}>
                      {data.companyInfo.name || 'Your Company'}
                    </h1>
                    <p className={clsx('text-sm whitespace-pre-line mt-1', data.template === 'modern' ? 'text-blue-100' : 'text-gray-600')}>
                      {data.companyInfo.address || 'Company Address'}
                    </p>
                  </div>
                  <div className="text-right">
                    <h2 className={clsx('text-3xl font-bold', data.template === 'modern' ? 'text-white' : templateStyles.accent)}>
                      INVOICE
                    </h2>
                    <p className={clsx('mt-2', data.template === 'modern' ? 'text-blue-100' : 'text-gray-600')}>
                      #{data.invoiceNumber || 'INV-000000'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client & Dates */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className={clsx('text-sm font-semibold mb-2', templateStyles.accent)}>Bill To</h3>
                  <p className="font-medium">{data.clientInfo.name || 'Client Name'}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{data.clientInfo.address || 'Client Address'}</p>
                  {data.clientInfo.email && (
                    <p className="text-sm text-gray-600">{data.clientInfo.email}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="mb-2">
                    <span className={clsx('text-sm font-semibold', templateStyles.accent)}>Invoice Date: </span>
                    <span className="text-gray-700">{data.invoiceDate}</span>
                  </div>
                  <div>
                    <span className={clsx('text-sm font-semibold', templateStyles.accent)}>Due Date: </span>
                    <span className="text-gray-700">{data.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className={clsx('mb-8', templateStyles.table)}>
                <table className="w-full">
                  <thead>
                    <tr className={templateStyles.tableHeader}>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Qty</th>
                      <th className="text-right py-3 px-4">Price</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lineItems.map((item) => (
                      <tr key={item.id} className={templateStyles.tableRow}>
                        <td className="py-3 px-4">{item.description || 'Item description'}</td>
                        <td className="text-right py-3 px-4">{item.quantity}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(item.unitPrice)}</td>
                        <td className="text-right py-3 px-4 font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  {data.taxRate > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Tax ({data.taxRate}%)</span>
                      <span className="font-medium">{formatCurrency(calculateTax())}</span>
                    </div>
                  )}
                  {data.discount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium">-{formatCurrency(data.discount)}</span>
                    </div>
                  )}
                  <div className={clsx('flex justify-between py-3', templateStyles.accent)}>
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Payment */}
              {(data.notes || data.paymentDetails) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  {data.notes && (
                    <div>
                      <h3 className={clsx('text-sm font-semibold mb-2', templateStyles.accent)}>Notes</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{data.notes}</p>
                    </div>
                  )}
                  {data.paymentDetails && (
                    <div>
                      <h3 className={clsx('text-sm font-semibold mb-2', templateStyles.accent)}>Payment Details</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{data.paymentDetails}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-preview,
          .invoice-preview * {
            visibility: visible;
          }
          .invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20mm;
            margin: 0;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default InvoiceGenerator;
