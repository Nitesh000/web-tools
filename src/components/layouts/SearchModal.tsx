import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { TOOLS } from '../../utils/constants';
import { AppIcon } from '../common/ToolIcon';

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOOLS;
    return TOOLS.filter((tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.shortDescription.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.features.some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  const goToTool = useCallback((path: string) => {
    onClose();
    navigate(path);
  }, [navigate, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Focus after the modal has mounted
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const tool = results[activeIndex];
        if (tool) goToTool(tool.path);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, results, activeIndex, onClose, goToTool]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No tools found for "{query}"
            </p>
          ) : (
            results.map((tool, index) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => goToTool(tool.path)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === activeIndex
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${tool.bgColor}`}>
                  <AppIcon name={tool.icon} className={`w-4.5 h-4.5 ${tool.color}`} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
                    {tool.name}
                  </span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                    {tool.shortDescription}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
