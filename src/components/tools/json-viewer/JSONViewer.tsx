import { useState, useCallback, useEffect, useRef, useMemo } from 'react';

interface TreeNodeProps {
  keyName: string | number;
  value: unknown;
  depth: number;
  searchQuery: string;
  path: string;
  expandedPaths: Set<string>;
  onToggle: (path: string) => void;
}

function TreeNode({ keyName, value, depth, searchQuery, path, expandedPaths, onToggle }: TreeNodeProps) {
  const isExpanded = expandedPaths.has(path);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  const matchesSearch = useMemo(() => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    const keyStr = String(keyName).toLowerCase();
    if (keyStr.includes(query)) return true;
    if (!isObject && String(value).toLowerCase().includes(query)) return true;
    return false;
  }, [searchQuery, keyName, value, isObject]);

  const getValuePreview = () => {
    if (isArray) return `Array(${(value as unknown[]).length})`;
    if (isObject) return `Object {${Object.keys(value as object).length} keys}`;
    if (typeof value === 'string') return `"${value}"`;
    if (value === null) return 'null';
    return String(value);
  };

  const getValueClass = () => {
    if (value === null) return 'text-orange-500 dark:text-orange-400';
    if (typeof value === 'boolean') return 'text-purple-600 dark:text-purple-400';
    if (typeof value === 'number') return 'text-blue-600 dark:text-blue-400';
    if (typeof value === 'string') return 'text-green-600 dark:text-green-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const indent = depth * 20;

  return (
    <div className="font-mono text-sm">
      <div
        className={`flex items-start py-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded transition-colors ${matchesSearch ? 'bg-yellow-100 dark:bg-yellow-900/30' : ''}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={() => isObject && onToggle(path)}
      >
        {isObject ? (
          <span className="w-4 h-4 flex items-center justify-center text-gray-500 mr-1 flex-shrink-0">
            {isExpanded ? '▼' : '▶'}
          </span>
        ) : (
          <span className="w-4 h-4 mr-1 flex-shrink-0" />
        )}
        <span className="text-purple-700 dark:text-purple-300 font-medium">
          {typeof keyName === 'number' ? `[${keyName}]` : `"${keyName}"`}
        </span>
        <span className="text-gray-500 mx-1">:</span>
        <span className={`${getValueClass()} ${isObject ? 'text-gray-500 dark:text-gray-400' : ''}`}>
          {getValuePreview()}
        </span>
      </div>
      {isObject && isExpanded && (
        <div>
          {Object.entries(value as object).map(([k, v], idx) => (
            <TreeNode
              key={`${path}-${k}-${idx}`}
              keyName={isArray ? idx : k}
              value={v}
              depth={depth + 1}
              searchQuery={searchQuery}
              path={`${path}.${k}`}
              expandedPaths={expandedPaths}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function JSONViewer() {
  const [jsonInput, setJsonInput] = useState('');
  const [parsedJson, setParsedJson] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'formatted' | 'raw'>('tree');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set(['root']));
  const [indentation, setIndentation] = useState(2);
  const [lineNumbers, setLineNumbers] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse JSON on input change
  useEffect(() => {
    if (!jsonInput.trim()) {
      setParsedJson(null);
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      setParsedJson(parsed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setParsedJson(null);
    }
  }, [jsonInput]);

  // Fullscreen handling
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const handleTogglePath = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    if (parsedJson === null) return;
    const paths = new Set<string>();
    const traverse = (obj: unknown, path: string) => {
      paths.add(path);
      if (obj !== null && typeof obj === 'object') {
        Object.entries(obj as object).forEach(([key, val]) => {
          traverse(val, `${path}.${key}`);
        });
      }
    };
    traverse(parsedJson, 'root');
    setExpandedPaths(paths);
  }, [parsedJson]);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set(['root']));
  }, []);

  const copyToClipboard = useCallback(async () => {
    if (parsedJson !== null) {
      await navigator.clipboard.writeText(JSON.stringify(parsedJson, null, indentation));
    }
  }, [parsedJson, indentation]);

  const downloadJson = useCallback(() => {
    if (parsedJson === null) return;
    const blob = new Blob([JSON.stringify(parsedJson, null, indentation)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [parsedJson, indentation]);

  const formatJson = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, indentation));
    } catch {
      // Keep original if invalid
    }
  }, [jsonInput, indentation]);

  const minifyJson = useCallback(() => {
    if (!jsonInput.trim()) return;
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
    } catch {
      // Keep original if invalid
    }
  }, [jsonInput]);

  const loadSampleJson = useCallback(() => {
    const sample = {
      name: 'Web Tools Suite',
      version: '1.0.0',
      tools: ['JSON Viewer', 'Markdown Editor', 'Image Compressor'],
      config: {
        theme: 'dark',
        features: {
          fullscreen: true,
          search: true,
          treeView: true,
        },
      },
      stats: {
        users: 50000,
        filesProcessed: 1000000,
        rating: 4.9,
      },
      isActive: true,
      lastUpdated: null,
    };
    setJsonInput(JSON.stringify(sample, null, 2));
  }, []);

  const getFormattedJson = useMemo(() => {
    if (!parsedJson) return '';
    return JSON.stringify(parsedJson, null, indentation);
  }, [parsedJson, indentation]);

  const formattedLines = useMemo(() => {
    return getFormattedJson.split('\n');
  }, [getFormattedJson]);

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col'
    : 'relative';

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => textareaRef.current?.focus()}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Paste JSON
        </button>
        <button
          onClick={loadSampleJson}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Load Sample
        </button>
        <button
          onClick={formatJson}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Format
        </button>
        <button
          onClick={minifyJson}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Minify
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        <button
          onClick={copyToClipboard}
          disabled={parsedJson === null}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Copy
        </button>
        <button
          onClick={downloadJson}
          disabled={parsedJson === null}
          className="px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        <select
          value={indentation}
          onChange={(e) => setIndentation(Number(e.target.value))}
          className="px-2 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border-none cursor-pointer"
        >
          <option value={2}>2 Spaces</option>
          <option value={4}>4 Spaces</option>
          <option value={8}>8 Spaces</option>
        </select>

        <div className="flex-1" />

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-1"
        >
          {isFullscreen ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Fullscreen
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Fullscreen
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className={`flex flex-1 ${isFullscreen ? 'h-[calc(100vh-60px)]' : 'min-h-[600px]'}`}>
        {/* Input Panel */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</span>
            {error && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </span>
            )}
            {!error && parsedJson !== null && (
              <span className="text-xs text-green-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Valid JSON
              </span>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here or click 'Load Sample' to try with example data..."
            className="flex-1 w-full p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Output Panel */}
        <div className="w-1/2 flex flex-col">
          {/* View Mode Tabs */}
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
            <div className="flex items-center gap-1">
              {(['tree', 'formatted', 'raw'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${viewMode === mode ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {viewMode === 'tree' && (
              <>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
                <button onClick={expandAll} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Expand All
                </button>
                <button onClick={collapseAll} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Collapse All
                </button>
              </>
            )}

            {viewMode === 'formatted' && (
              <>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
                <label className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={lineNumbers}
                    onChange={(e) => setLineNumbers(e.target.checked)}
                    className="w-3 h-3"
                  />
                  Line Numbers
                </label>
              </>
            )}

            <div className="flex-1" />

            {viewMode === 'tree' && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keys/values..."
                className="px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
              />
            )}
          </div>

          {/* Output Content */}
          <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
            {parsedJson === null ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Paste JSON to view</p>
                </div>
              </div>
            ) : viewMode === 'tree' ? (
              <div className="p-4">
                <TreeNode
                  keyName="root"
                  value={parsedJson}
                  depth={0}
                  searchQuery={searchQuery}
                  path="root"
                  expandedPaths={expandedPaths}
                  onToggle={handleTogglePath}
                />
              </div>
            ) : viewMode === 'formatted' ? (
              <div className="p-4 font-mono text-sm">
                {formattedLines.map((line, idx) => (
                  <div key={idx} className="flex hover:bg-gray-50 dark:hover:bg-gray-800">
                    {lineNumbers && (
                      <span className="w-12 pr-4 text-right text-gray-400 dark:text-gray-600 select-none flex-shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <pre className="flex-1 whitespace-pre-wrap break-all text-gray-800 dark:text-gray-200">{line}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <pre className="p-4 font-mono text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">
                {getFormattedJson}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      {parsedJson !== null && (
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400">
          <span>
            Size: <strong>{new Blob([JSON.stringify(parsedJson)]).size.toLocaleString()}</strong> bytes
          </span>
          <span>
            Formatted: <strong>{new Blob([getFormattedJson]).size.toLocaleString()}</strong> bytes
          </span>
          <span>
            Lines: <strong>{formattedLines.length.toLocaleString()}</strong>
          </span>
          {typeof parsedJson === 'object' && parsedJson !== null && (
            <span>
              {Array.isArray(parsedJson) ? 'Items' : 'Keys'}:{' '}
              <strong>{Object.keys(parsedJson).length.toLocaleString()}</strong>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default JSONViewer;
