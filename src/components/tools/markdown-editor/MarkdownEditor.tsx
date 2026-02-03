import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

// Simple markdown parser for preview
function parseMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^###### (.*$)/gm, '<h6 class="text-sm font-semibold mt-4 mb-2">$1</h6>')
    .replace(/^##### (.*$)/gm, '<h5 class="text-base font-semibold mt-4 mb-2">$1</h5>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-semibold mt-4 mb-2">$1</h4>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-5 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4 font-mono text-sm"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/__([^_]+)__/g, '<strong class="font-bold">$1</strong>')
    // Italic
    .replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
    .replace(/_([^_]+)_/g, '<em class="italic">$1</em>')
    // Strikethrough
    .replace(/~~([^~]+)~~/g, '<del class="line-through">$1</del>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
    // Blockquotes
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400">$1</blockquote>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="my-6 border-gray-300 dark:border-gray-600" />')
    // Unordered lists
    .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="my-4">')
    // Line breaks
    .replace(/\n/g, '<br />');
}

const STORAGE_KEY = 'markdown-editor-content';
const STORAGE_DOCUMENTS_KEY = 'markdown-editor-documents';

interface Document {
  id: string;
  name: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

const TEMPLATES = {
  blank: '',
  readme: `# Project Name

A brief description of what this project does and who it's for.

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

\`\`\`bash
npm install my-project
\`\`\`

## Usage

\`\`\`javascript
import myProject from 'my-project'

myProject.doSomething()
\`\`\`

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

## License

MIT`,
  blogPost: `# Blog Post Title

*Published on January 1, 2024*

![Featured Image](https://via.placeholder.com/800x400)

## Introduction

Start with an engaging introduction that hooks your readers and tells them what they'll learn.

## Main Content

### Section 1

Your main content goes here. Use **bold** for emphasis and *italics* for subtle highlights.

### Section 2

> "A great quote to break up the content and add perspective."

### Section 3

Here's a code example:

\`\`\`javascript
const example = "Hello, World!";
console.log(example);
\`\`\`

## Conclusion

Wrap up your post with key takeaways and a call to action.

---

*Thanks for reading! Share your thoughts in the comments.*`,
  documentation: `# Documentation Title

## Overview

Brief overview of what this documentation covers.

## Getting Started

### Prerequisites

- Requirement 1
- Requirement 2

### Installation

Step-by-step installation instructions.

## API Reference

### \`functionName(param)\`

Description of the function.

**Parameters:**
- \`param\` (type) - Description

**Returns:** Description of return value

**Example:**
\`\`\`javascript
functionName("value")
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | string | "default" | Description |
| option2 | boolean | true | Description |

## FAQ

**Q: Common question?**
A: Answer to the question.

## Support

For issues, please open a GitHub issue.`,
  notes: `# Meeting Notes

**Date:** January 1, 2024
**Attendees:** Person 1, Person 2, Person 3

## Agenda

1. Topic 1
2. Topic 2
3. Topic 3

## Discussion

### Topic 1

- Key point discussed
- Decision made
- Action item assigned

### Topic 2

- Key point discussed
- Questions raised

## Action Items

- [ ] Task 1 - @Person1 - Due: Jan 5
- [ ] Task 2 - @Person2 - Due: Jan 7
- [ ] Task 3 - @Person3 - Due: Jan 10

## Next Meeting

Date: January 8, 2024
Topics: Follow-up items`,
};

export function MarkdownEditor() {
  const [content, setContent] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('Untitled');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedContent = localStorage.getItem(STORAGE_KEY);
    const savedDocs = localStorage.getItem(STORAGE_DOCUMENTS_KEY);

    if (savedContent) {
      setContent(savedContent);
    }
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saveTimer = setTimeout(() => {
      setIsSaving(true);
      localStorage.setItem(STORAGE_KEY, content);
      setLastSaved(new Date());
      setTimeout(() => setIsSaving(false), 500);
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [content]);

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

  const htmlContent = useMemo(() => parseMarkdown(content), [content]);

  const insertText = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) + before + selectedText + after + content.substring(end);

    setContent(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const cursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  }, [content]);

  const handleToolbarAction = useCallback((action: string) => {
    switch (action) {
      case 'bold':
        insertText('**', '**');
        break;
      case 'italic':
        insertText('*', '*');
        break;
      case 'strikethrough':
        insertText('~~', '~~');
        break;
      case 'h1':
        insertText('# ');
        break;
      case 'h2':
        insertText('## ');
        break;
      case 'h3':
        insertText('### ');
        break;
      case 'link':
        insertText('[', '](url)');
        break;
      case 'image':
        insertText('![alt text](', ')');
        break;
      case 'code':
        insertText('`', '`');
        break;
      case 'codeblock':
        insertText('```\n', '\n```');
        break;
      case 'quote':
        insertText('> ');
        break;
      case 'ul':
        insertText('- ');
        break;
      case 'ol':
        insertText('1. ');
        break;
      case 'hr':
        insertText('\n---\n');
        break;
    }
  }, [insertText]);

  const loadTemplate = useCallback((template: keyof typeof TEMPLATES) => {
    setContent(TEMPLATES[template]);
    setDocumentName('Untitled');
    setCurrentDocId(null);
  }, []);

  const saveDocument = useCallback(() => {
    const now = Date.now();
    if (currentDocId) {
      // Update existing
      setDocuments((docs) => {
        const updated = docs.map((d) =>
          d.id === currentDocId ? { ...d, content, name: documentName, updatedAt: now } : d
        );
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(updated));
        return updated;
      });
    } else {
      // Create new
      const newDoc: Document = {
        id: `doc-${now}`,
        name: documentName,
        content,
        createdAt: now,
        updatedAt: now,
      };
      setDocuments((docs) => {
        const updated = [...docs, newDoc];
        if (typeof window !== 'undefined') localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(updated));
        return updated;
      });
      setCurrentDocId(newDoc.id);
    }
    setLastSaved(new Date());
  }, [content, documentName, currentDocId]);

  const loadDocument = useCallback((doc: Document) => {
    setContent(doc.content);
    setDocumentName(doc.name);
    setCurrentDocId(doc.id);
    setShowSidebar(false);
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((docs) => {
      const updated = docs.filter((d) => d.id !== id);
      if (typeof window !== 'undefined') localStorage.setItem(STORAGE_DOCUMENTS_KEY, JSON.stringify(updated));
      return updated;
    });
    if (currentDocId === id) {
      setContent('');
      setDocumentName('Untitled');
      setCurrentDocId(null);
    }
  }, [currentDocId]);

  const newDocument = useCallback(() => {
    setContent('');
    setDocumentName('Untitled');
    setCurrentDocId(null);
    setShowSidebar(false);
  }, []);

  const downloadMarkdown = useCallback(() => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, documentName]);

  const downloadHtml = useCallback(() => {
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${documentName}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    pre { background: #f4f4f4; padding: 16px; border-radius: 8px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    img { max-width: 100%; }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; }
    a { color: #0066cc; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, documentName, htmlContent]);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(content);
  }, [content]);

  const wordCount = useMemo(() => {
    return content.trim() ? content.trim().split(/\s+/).length : 0;
  }, [content]);

  const charCount = content.length;

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col'
    : 'relative';

  return (
    <div className={containerClasses}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="Documents"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Formatting buttons */}
        <button onClick={() => handleToolbarAction('bold')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors font-bold" title="Bold (Ctrl+B)">B</button>
        <button onClick={() => handleToolbarAction('italic')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors italic" title="Italic (Ctrl+I)">I</button>
        <button onClick={() => handleToolbarAction('strikethrough')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors line-through" title="Strikethrough">S</button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        <button onClick={() => handleToolbarAction('h1')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-sm font-bold" title="Heading 1">H1</button>
        <button onClick={() => handleToolbarAction('h2')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-sm font-bold" title="Heading 2">H2</button>
        <button onClick={() => handleToolbarAction('h3')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-sm font-bold" title="Heading 3">H3</button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        <button onClick={() => handleToolbarAction('link')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Link">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button onClick={() => handleToolbarAction('image')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Image">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button onClick={() => handleToolbarAction('code')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors font-mono text-sm" title="Inline Code">{`</>`}</button>
        <button onClick={() => handleToolbarAction('codeblock')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Code Block">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        <button onClick={() => handleToolbarAction('quote')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Quote">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
        <button onClick={() => handleToolbarAction('ul')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Bullet List">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
        <button onClick={() => handleToolbarAction('ol')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors text-sm font-medium" title="Numbered List">1.</button>
        <button onClick={() => handleToolbarAction('hr')} className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors" title="Horizontal Rule">—</button>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Templates dropdown */}
        <select
          onChange={(e) => loadTemplate(e.target.value as keyof typeof TEMPLATES)}
          value=""
          className="px-2 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border-none cursor-pointer"
        >
          <option value="" disabled>Templates</option>
          <option value="blank">Blank</option>
          <option value="readme">README</option>
          <option value="blogPost">Blog Post</option>
          <option value="documentation">Documentation</option>
          <option value="notes">Meeting Notes</option>
        </select>

        <div className="flex-1" />

        {/* View mode buttons */}
        <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-md p-0.5">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-2 py-1 text-xs rounded transition-colors ${viewMode === 'edit' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-2 py-1 text-xs rounded transition-colors ${viewMode === 'split' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-2 py-1 text-xs rounded transition-colors ${viewMode === 'preview' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Preview
          </button>
        </div>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>

      {/* Document name and actions */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="flex-1 max-w-xs px-2 py-1 text-sm bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none text-gray-800 dark:text-gray-200"
          placeholder="Document name"
        />
        <button
          onClick={saveDocument}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Copy
        </button>
        <button
          onClick={downloadMarkdown}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          .md
        </button>
        <button
          onClick={downloadHtml}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          .html
        </button>

        <div className="flex-1" />

        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
        </span>
      </div>

      {/* Main content area */}
      <div className={`flex flex-1 relative ${isFullscreen ? 'h-[calc(100vh-120px)]' : 'min-h-[500px]'}`}>
        {/* Sidebar */}
        {showSidebar && (
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-10 flex flex-col">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-200">Documents</span>
              <button
                onClick={newDocument}
                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {documents.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No saved documents
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-3 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${currentDocId === doc.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    onClick={() => loadDocument(doc)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{doc.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Editor */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-200 dark:border-gray-700`}>
            <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Markdown
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing in Markdown..."
              className="flex-1 w-full p-4 font-mono text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div className="px-3 py-1 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Preview
            </div>
            <div
              className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: `<p class="my-4">${htmlContent}</p>` }}
            />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-6 text-xs text-gray-600 dark:text-gray-400">
        <span>Words: <strong>{wordCount.toLocaleString()}</strong></span>
        <span>Characters: <strong>{charCount.toLocaleString()}</strong></span>
        <span>Lines: <strong>{content.split('\n').length.toLocaleString()}</strong></span>
        <div className="flex-1" />
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Auto-save enabled
        </span>
      </div>
    </div>
  );
}

export default MarkdownEditor;
