import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '../../common/Button';

type IndentationType = '2-spaces' | '4-spaces' | 'tabs';
type OutputFormat = 'json' | 'yaml' | 'typescript' | 'xml';
type ViewMode = 'formatted' | 'tree' | 'compare';

interface JSONError {
  message: string;
  line: number;
  column: number;
}

interface TreeNode {
  key: string;
  value: unknown;
  type: string;
  path: string;
  isExpanded: boolean;
  children?: TreeNode[];
}

// Convert JSON to YAML
function jsonToYaml(obj: unknown, indent: number = 0): string {
  const spaces = '  '.repeat(indent);

  if (obj === null) return 'null';
  if (obj === undefined) return '~';
  if (typeof obj === 'boolean') return obj.toString();
  if (typeof obj === 'number') return obj.toString();
  if (typeof obj === 'string') {
    if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.includes("'") || obj.includes('"')) {
      return `|\n${spaces}  ${obj.split('\n').join(`\n${spaces}  `)}`;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map((item) => {
      const value = jsonToYaml(item, indent + 1);
      if (typeof item === 'object' && item !== null) {
        return `\n${spaces}- ${value.trim()}`;
      }
      return `\n${spaces}- ${value}`;
    }).join('');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([key, value]) => {
      const yamlValue = jsonToYaml(value, indent + 1);
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return `${indent > 0 ? '\n' : ''}${spaces}${key}:${yamlValue}`;
      }
      if (Array.isArray(value)) {
        return `${indent > 0 ? '\n' : ''}${spaces}${key}:${yamlValue}`;
      }
      return `${indent > 0 ? '\n' : ''}${spaces}${key}: ${yamlValue}`;
    }).join('');
  }

  return String(obj);
}

// Convert JSON to TypeScript interface
function jsonToTypeScript(obj: unknown, interfaceName: string = 'Root', indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  const interfaces: string[] = [];

  function getType(value: unknown, key: string, currentIndent: number): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'string') return 'string';

    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const itemType = getType(value[0], key, currentIndent);
      return `${itemType}[]`;
    }

    if (typeof value === 'object') {
      const nestedInterfaceName = key.charAt(0).toUpperCase() + key.slice(1);
      const nestedSpaces = '  '.repeat(currentIndent);
      const props = Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => {
          const propType = getType(v, k, currentIndent + 1);
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
          return `${nestedSpaces}  ${safeKey}: ${propType};`;
        })
        .join('\n');

      if (currentIndent === 0) {
        interfaces.push(`interface ${nestedInterfaceName} {\n${props}\n}`);
        return nestedInterfaceName;
      }
      return `{\n${props}\n${nestedSpaces}}`;
    }

    return 'unknown';
  }

  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    const props = Object.entries(obj as Record<string, unknown>)
      .map(([key, value]) => {
        const propType = getType(value, key, 1);
        const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        return `${spaces}  ${safeKey}: ${propType};`;
      })
      .join('\n');

    return `${interfaces.join('\n\n')}\n\ninterface ${interfaceName} {\n${props}\n}`;
  }

  return `type ${interfaceName} = ${getType(obj, interfaceName, indent)};`;
}

// Convert JSON to XML
function jsonToXml(obj: unknown, rootName: string = 'root', indent: number = 0): string {
  void indent; // Used by convert function

  function escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function convert(value: unknown, tagName: string, currentIndent: number): string {
    const currentSpaces = '  '.repeat(currentIndent);

    if (value === null || value === undefined) {
      return `${currentSpaces}<${tagName} />\n`;
    }

    if (typeof value === 'boolean' || typeof value === 'number') {
      return `${currentSpaces}<${tagName}>${value}</${tagName}>\n`;
    }

    if (typeof value === 'string') {
      return `${currentSpaces}<${tagName}>${escapeXml(value)}</${tagName}>\n`;
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => convert(item, 'item', currentIndent))
        .join('');
    }

    if (typeof value === 'object') {
      const children = Object.entries(value as Record<string, unknown>)
        .map(([key, val]) => {
          const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
          return convert(val, safeKey, currentIndent + 1);
        })
        .join('');
      return `${currentSpaces}<${tagName}>\n${children}${currentSpaces}</${tagName}>\n`;
    }

    return `${currentSpaces}<${tagName}>${String(value)}</${tagName}>\n`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(obj, rootName, indent)}`;
}

// Parse JSON with detailed error information
function parseJSONWithErrors(input: string): { data: unknown | null; error: JSONError | null } {
  try {
    const data = JSON.parse(input);
    return { data, error: null };
  } catch (e) {
    if (e instanceof SyntaxError) {
      const match = e.message.match(/position (\d+)/);
      let position = match ? parseInt(match[1], 10) : 0;

      let line = 1;
      let column = 1;
      for (let i = 0; i < position && i < input.length; i++) {
        if (input[i] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
      }

      return {
        data: null,
        error: {
          message: e.message,
          line,
          column,
        },
      };
    }
    return {
      data: null,
      error: {
        message: String(e),
        line: 1,
        column: 1,
      },
    };
  }
}

// Build tree structure from JSON
function buildTree(data: unknown, key: string = 'root', path: string = ''): TreeNode {
  const currentPath = path ? `${path}.${key}` : key;

  if (data === null) {
    return { key, value: null, type: 'null', path: currentPath, isExpanded: false };
  }

  if (Array.isArray(data)) {
    return {
      key,
      value: data,
      type: 'array',
      path: currentPath,
      isExpanded: true,
      children: data.map((item, index) => buildTree(item, `[${index}]`, currentPath)),
    };
  }

  if (typeof data === 'object') {
    return {
      key,
      value: data,
      type: 'object',
      path: currentPath,
      isExpanded: true,
      children: Object.entries(data as Record<string, unknown>).map(([k, v]) =>
        buildTree(v, k, currentPath)
      ),
    };
  }

  return {
    key,
    value: data,
    type: typeof data,
    path: currentPath,
    isExpanded: false,
  };
}

// Syntax highlighting for JSON
function highlightJSON(json: string): { html: string; lines: string[] } {
  const lines = json.split('\n');
  const highlightedLines = lines.map((line) => {
    return line
      .replace(/"([^"\\]|\\.)*"(?=\s*:)/g, '<span class="text-purple-400">$&</span>') // keys
      .replace(/"([^"\\]|\\.)*"(?!\s*:)/g, '<span class="text-green-400">$&</span>') // strings
      .replace(/\b(true|false)\b/g, '<span class="text-orange-400">$&</span>') // booleans
      .replace(/\b(null)\b/g, '<span class="text-red-400">$&</span>') // null
      .replace(/\b(-?\d+\.?\d*(?:[eE][+-]?\d+)?)\b(?=\s*[,\]\}]|\s*$)/g, '<span class="text-blue-400">$&</span>'); // numbers
  });

  return {
    html: highlightedLines.join('\n'),
    lines,
  };
}

// Compare two JSON objects
function compareJSON(
  obj1: unknown,
  obj2: unknown,
  path: string = ''
): { added: string[]; removed: string[]; changed: string[]; unchanged: string[] } {
  const result = {
    added: [] as string[],
    removed: [] as string[],
    changed: [] as string[],
    unchanged: [] as string[],
  };

  if (obj1 === obj2) {
    result.unchanged.push(path || 'root');
    return result;
  }

  if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
    if (path) result.changed.push(path);
    return result;
  }

  if (typeof obj1 !== 'object') {
    if (obj1 !== obj2) {
      result.changed.push(path || 'root');
    } else {
      result.unchanged.push(path || 'root');
    }
    return result;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLen = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLen; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= obj1.length) {
        result.added.push(itemPath);
      } else if (i >= obj2.length) {
        result.removed.push(itemPath);
      } else {
        const subResult = compareJSON(obj1[i], obj2[i], itemPath);
        result.added.push(...subResult.added);
        result.removed.push(...subResult.removed);
        result.changed.push(...subResult.changed);
        result.unchanged.push(...subResult.unchanged);
      }
    }
    return result;
  }

  const keys1 = Object.keys(obj1 as object);
  const keys2 = Object.keys(obj2 as object);
  const allKeys = new Set([...keys1, ...keys2]);

  for (const key of allKeys) {
    const keyPath = path ? `${path}.${key}` : key;
    const hasKey1 = key in (obj1 as object);
    const hasKey2 = key in (obj2 as object);

    if (!hasKey1) {
      result.added.push(keyPath);
    } else if (!hasKey2) {
      result.removed.push(keyPath);
    } else {
      const subResult = compareJSON(
        (obj1 as Record<string, unknown>)[key],
        (obj2 as Record<string, unknown>)[key],
        keyPath
      );
      result.added.push(...subResult.added);
      result.removed.push(...subResult.removed);
      result.changed.push(...subResult.changed);
      result.unchanged.push(...subResult.unchanged);
    }
  }

  return result;
}

// Tree Node Component
function TreeNodeComponent({
  node,
  onToggle,
  searchTerm,
  level = 0,
}: {
  node: TreeNode;
  onToggle: (path: string) => void;
  searchTerm: string;
  level?: number;
}) {
  const isMatch = searchTerm && (
    node.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(node.value).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasChildren = node.children && node.children.length > 0;

  const renderValue = () => {
    if (node.type === 'object') {
      return <span className="text-slate-400">{`{${node.children?.length || 0}}`}</span>;
    }
    if (node.type === 'array') {
      return <span className="text-slate-400">{`[${node.children?.length || 0}]`}</span>;
    }
    if (node.type === 'string') {
      return <span className="text-green-400">"{String(node.value)}"</span>;
    }
    if (node.type === 'number') {
      return <span className="text-blue-400">{String(node.value)}</span>;
    }
    if (node.type === 'boolean') {
      return <span className="text-orange-400">{String(node.value)}</span>;
    }
    if (node.type === 'null') {
      return <span className="text-red-400">null</span>;
    }
    return <span className="text-slate-300">{String(node.value)}</span>;
  };

  return (
    <div className="font-mono text-sm">
      <div
        className={clsx(
          'flex items-center gap-1 py-0.5 px-1 rounded hover:bg-slate-700/50 cursor-pointer',
          isMatch && 'bg-yellow-500/20 border border-yellow-500/50'
        )}
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => hasChildren && onToggle(node.path)}
        role={hasChildren ? 'button' : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onKeyDown={(e) => {
          if (hasChildren && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onToggle(node.path);
          }
        }}
        aria-expanded={hasChildren ? node.isExpanded : undefined}
      >
        {hasChildren ? (
          <span className="w-4 h-4 flex items-center justify-center text-slate-400">
            {node.isExpanded ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}
        <span className="text-purple-400">{node.key}</span>
        <span className="text-slate-500">:</span>
        {renderValue()}
      </div>
      {hasChildren && node.isExpanded && (
        <div>
          {node.children!.map((child, index) => (
            <TreeNodeComponent
              key={`${child.path}-${index}`}
              node={child}
              onToggle={onToggle}
              searchTerm={searchTerm}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentation, setIndentation] = useState<IndentationType>('2-spaces');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('json');
  const [viewMode, setViewMode] = useState<ViewMode>('formatted');
  const [error, setError] = useState<JSONError | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [compareInput, setCompareInput] = useState('');
  const [compareResult, setCompareResult] = useState<ReturnType<typeof compareJSON> | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const outputRef = useRef<HTMLPreElement>(null);

  // Get indentation string based on setting
  const getIndent = useCallback(() => {
    switch (indentation) {
      case '2-spaces': return 2;
      case '4-spaces': return 4;
      case 'tabs': return '\t';
      default: return 2;
    }
  }, [indentation]);

  // Format JSON
  const formatJSON = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      setIsValid(null);
      return;
    }

    const { data, error: parseError } = parseJSONWithErrors(input);

    if (parseError) {
      setError(parseError);
      setIsValid(false);
      setOutput('');
      setTreeData(null);
      return;
    }

    setError(null);
    setIsValid(true);
    setTreeData(buildTree(data));

    let result: string;
    switch (outputFormat) {
      case 'yaml':
        result = jsonToYaml(data).trim();
        break;
      case 'typescript':
        result = jsonToTypeScript(data);
        break;
      case 'xml':
        result = jsonToXml(data);
        break;
      default:
        result = JSON.stringify(data, null, getIndent());
    }

    setOutput(result);
  }, [input, outputFormat, getIndent]);

  // Minify JSON
  const minifyJSON = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      setIsValid(null);
      return;
    }

    const { data, error: parseError } = parseJSONWithErrors(input);

    if (parseError) {
      setError(parseError);
      setIsValid(false);
      setOutput('');
      return;
    }

    setError(null);
    setIsValid(true);
    setOutput(JSON.stringify(data));
    setTreeData(buildTree(data));
  }, [input]);

  // Validate JSON
  const validateJSON = useCallback(() => {
    if (!input.trim()) {
      setError(null);
      setIsValid(null);
      return;
    }

    const { data, error: parseError } = parseJSONWithErrors(input);

    if (parseError) {
      setError(parseError);
      setIsValid(false);
      setTreeData(null);
    } else {
      setError(null);
      setIsValid(true);
      setTreeData(buildTree(data));
    }
  }, [input]);

  // Compare JSON objects
  const performCompare = useCallback(() => {
    const { data: data1, error: error1 } = parseJSONWithErrors(input);
    const { data: data2, error: error2 } = parseJSONWithErrors(compareInput);

    if (error1 || error2) {
      setCompareResult(null);
      if (error1) setError(error1);
      return;
    }

    setError(null);
    setCompareResult(compareJSON(data1, data2));
  }, [input, compareInput]);

  // Toggle tree node expansion
  const toggleTreeNode = useCallback((path: string) => {
    setTreeData((prevTree) => {
      if (!prevTree) return null;

      const toggleNode = (node: TreeNode): TreeNode => {
        if (node.path === path) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        if (node.children) {
          return { ...node, children: node.children.map(toggleNode) };
        }
        return node;
      };

      return toggleNode(prevTree);
    });
  }, []);

  // Copy output to clipboard
  const copyToClipboard = useCallback(async () => {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [output]);

  // Download as file
  const downloadFile = useCallback(() => {
    if (!output) return;

    const extensions: Record<OutputFormat, string> = {
      json: 'json',
      yaml: 'yaml',
      typescript: 'ts',
      xml: 'xml',
    };

    const mimeTypes: Record<OutputFormat, string> = {
      json: 'application/json',
      yaml: 'text/yaml',
      typescript: 'text/typescript',
      xml: 'application/xml',
    };

    const blob = new Blob([output], { type: mimeTypes[outputFormat] });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `formatted.${extensions[outputFormat]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [output, outputFormat]);

  // Highlighted output with line numbers
  const highlightedOutput = useMemo(() => {
    if (!output || outputFormat !== 'json') {
      return { html: output, lines: output.split('\n') };
    }
    return highlightJSON(output);
  }, [output, outputFormat]);

  // Auto-format on input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        formatJSON();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [input, formatJSON]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={formatJSON}
            variant="primary"
            size="sm"
            aria-label="Format and beautify JSON"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Format
          </Button>
          <Button
            onClick={minifyJSON}
            variant="secondary"
            size="sm"
            aria-label="Minify JSON"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            Minify
          </Button>
          <Button
            onClick={validateJSON}
            variant="outline"
            size="sm"
            aria-label="Validate JSON"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Validate
          </Button>
        </div>

        {/* Indentation selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="indentation-select" className="text-sm text-slate-300">
            Indent:
          </label>
          <select
            id="indentation-select"
            value={indentation}
            onChange={(e) => setIndentation(e.target.value as IndentationType)}
            className="bg-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="2-spaces">2 Spaces</option>
            <option value="4-spaces">4 Spaces</option>
            <option value="tabs">Tabs</option>
          </select>
        </div>
      </div>

      {/* Validation status */}
      {isValid !== null && (
        <div
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg',
            isValid
              ? 'bg-green-900/30 border border-green-700/50 text-green-400'
              : 'bg-red-900/30 border border-red-700/50 text-red-400'
          )}
          role="status"
          aria-live="polite"
        >
          {isValid ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Valid JSON</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Invalid JSON</span>
            </>
          )}
        </div>
      )}

      {/* Error display */}
      {error && (
        <div
          className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 text-red-400"
          role="alert"
        >
          <div className="font-semibold mb-1">Error at Line {error.line}, Column {error.column}</div>
          <div className="text-sm font-mono">{error.message}</div>
        </div>
      )}

      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <label htmlFor="json-input" className="block text-sm font-medium text-slate-300">
            Input JSON
          </label>
          <div className="relative">
            <textarea
              id="json-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here, e.g., {"key": "value"}'
              className={clsx(
                'w-full h-80 p-4 font-mono text-sm rounded-lg resize-none',
                'bg-slate-900 text-slate-200 border',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                'placeholder:text-slate-500',
                error
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-600'
              )}
              spellCheck={false}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'json-error' : undefined}
            />
            {input && (
              <button
                onClick={() => {
                  setInput('');
                  setOutput('');
                  setError(null);
                  setIsValid(null);
                  setTreeData(null);
                }}
                className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
                aria-label="Clear input"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-300">
              Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className={clsx(
                  'p-1.5 rounded transition-colors',
                  output
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    : 'text-slate-600 cursor-not-allowed'
                )}
                aria-label="Copy to clipboard"
              >
                {copySuccess ? (
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
              <button
                onClick={downloadFile}
                disabled={!output}
                className={clsx(
                  'p-1.5 rounded transition-colors',
                  output
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    : 'text-slate-600 cursor-not-allowed'
                )}
                aria-label="Download file"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="relative bg-slate-900 border border-slate-600 rounded-lg overflow-hidden">
            <pre
              ref={outputRef}
              className="h-80 p-4 overflow-auto font-mono text-sm text-slate-200"
              tabIndex={0}
              aria-label="Formatted output"
            >
              {outputFormat === 'json' && output ? (
                <code className="flex">
                  <span className="select-none pr-4 text-slate-500 border-r border-slate-700 mr-4">
                    {highlightedOutput.lines.map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: highlightedOutput.html }} />
                </code>
              ) : (
                <code>{output || 'Output will appear here...'}</code>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex gap-4" aria-label="View modes">
          <button
            onClick={() => setViewMode('formatted')}
            className={clsx(
              'pb-2 px-1 text-sm font-medium border-b-2 transition-colors',
              viewMode === 'formatted'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
            aria-current={viewMode === 'formatted' ? 'page' : undefined}
          >
            Formatted
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={clsx(
              'pb-2 px-1 text-sm font-medium border-b-2 transition-colors',
              viewMode === 'tree'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
            aria-current={viewMode === 'tree' ? 'page' : undefined}
          >
            Tree View
          </button>
          <button
            onClick={() => setViewMode('compare')}
            className={clsx(
              'pb-2 px-1 text-sm font-medium border-b-2 transition-colors',
              viewMode === 'compare'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
            aria-current={viewMode === 'compare' ? 'page' : undefined}
          >
            Compare
          </button>
        </nav>
      </div>

      {/* Tree View Panel */}
      {viewMode === 'tree' && treeData && (
        <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
          <div className="mb-4">
            <label htmlFor="tree-search" className="sr-only">Search in JSON</label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="tree-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search keys or values..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="max-h-96 overflow-auto">
            <TreeNodeComponent
              node={treeData}
              onToggle={toggleTreeNode}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      )}

      {/* Compare Panel */}
      {viewMode === 'compare' && (
        <div className="space-y-4">
          <div>
            <label htmlFor="compare-input" className="block text-sm font-medium text-slate-300 mb-2">
              JSON to Compare (Second JSON)
            </label>
            <textarea
              id="compare-input"
              value={compareInput}
              onChange={(e) => setCompareInput(e.target.value)}
              placeholder='Paste second JSON to compare, e.g., {"key": "value2"}'
              className="w-full h-40 p-4 font-mono text-sm rounded-lg resize-none bg-slate-900 text-slate-200 border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500"
              spellCheck={false}
            />
          </div>
          <Button onClick={performCompare} variant="primary" size="sm">
            Compare JSON
          </Button>

          {compareResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                <h4 className="text-green-400 font-medium mb-2">Added ({compareResult.added.length})</h4>
                <ul className="text-sm text-green-300 space-y-1 font-mono max-h-40 overflow-auto">
                  {compareResult.added.map((path, i) => (
                    <li key={i}>{path}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                <h4 className="text-red-400 font-medium mb-2">Removed ({compareResult.removed.length})</h4>
                <ul className="text-sm text-red-300 space-y-1 font-mono max-h-40 overflow-auto">
                  {compareResult.removed.map((path, i) => (
                    <li key={i}>{path}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-medium mb-2">Changed ({compareResult.changed.length})</h4>
                <ul className="text-sm text-yellow-300 space-y-1 font-mono max-h-40 overflow-auto">
                  {compareResult.changed.map((path, i) => (
                    <li key={i}>{path}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                <h4 className="text-slate-400 font-medium mb-2">Unchanged ({compareResult.unchanged.length})</h4>
                <ul className="text-sm text-slate-300 space-y-1 font-mono max-h-40 overflow-auto">
                  {compareResult.unchanged.slice(0, 20).map((path, i) => (
                    <li key={i}>{path}</li>
                  ))}
                  {compareResult.unchanged.length > 20 && (
                    <li className="text-slate-500">...and {compareResult.unchanged.length - 20} more</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Convert to Other Formats */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Convert to Other Formats</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setOutputFormat('json');
              formatJSON();
            }}
            variant={outputFormat === 'json' ? 'primary' : 'outline'}
            size="sm"
          >
            JSON
          </Button>
          <Button
            onClick={() => {
              setOutputFormat('yaml');
              formatJSON();
            }}
            variant={outputFormat === 'yaml' ? 'primary' : 'outline'}
            size="sm"
          >
            YAML
          </Button>
          <Button
            onClick={() => {
              setOutputFormat('typescript');
              formatJSON();
            }}
            variant={outputFormat === 'typescript' ? 'primary' : 'outline'}
            size="sm"
          >
            TypeScript Interface
          </Button>
          <Button
            onClick={() => {
              setOutputFormat('xml');
              formatJSON();
            }}
            variant={outputFormat === 'xml' ? 'primary' : 'outline'}
            size="sm"
          >
            XML
          </Button>
        </div>
      </div>
    </div>
  );
}

export default JSONFormatter;
