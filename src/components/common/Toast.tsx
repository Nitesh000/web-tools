import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'border-green-500/50 bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  error: 'border-red-500/50 bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  info: 'border-blue-500/50 bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
};

const VARIANT_ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, variant }]);
    const timer = setTimeout(() => dismissToast(id), 2500);
    timers.current.set(id, timer);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = VARIANT_ICONS[toast.variant];
          return (
            <div
              key={toast.id}
              role="status"
              className={`flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg backdrop-blur-sm animate-slide-up ${VARIANT_STYLES[toast.variant]}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">{toast.message}</span>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="ml-2 opacity-60 hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
