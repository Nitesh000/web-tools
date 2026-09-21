import { Fragment } from 'react';

// Tokenizes formatted JSON text into colored spans (keys, strings, numbers, booleans, null, punctuation).
const TOKEN_REGEX = /("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g;

export interface JsonHighlightProps {
  json: string;
  className?: string;
}

export function JsonHighlight({ json, className }: JsonHighlightProps) {
  const parts: { text: string; className: string }[] = [];
  let lastIndex = 0;

  for (const match of json.matchAll(TOKEN_REGEX)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ text: json.slice(lastIndex, index), className: '' });
    }

    const token = match[0];
    let tokenClass = 'text-blue-600 dark:text-blue-400'; // number
    if (/^"/.test(token)) {
      tokenClass = token.trimEnd().endsWith(':')
        ? 'text-purple-700 dark:text-purple-300 font-medium'
        : 'text-green-600 dark:text-green-400';
    } else if (token === 'true' || token === 'false') {
      tokenClass = 'text-orange-600 dark:text-orange-400';
    } else if (token === 'null') {
      tokenClass = 'text-red-500 dark:text-red-400';
    }

    parts.push({ text: token, className: tokenClass });
    lastIndex = index + token.length;
  }

  if (lastIndex < json.length) {
    parts.push({ text: json.slice(lastIndex), className: '' });
  }

  return (
    <span className={className}>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part.className ? <span className={part.className}>{part.text}</span> : part.text}
        </Fragment>
      ))}
    </span>
  );
}

export default JsonHighlight;
