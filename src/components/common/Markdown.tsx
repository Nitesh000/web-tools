import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import clsx from 'clsx';

export interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Shared markdown renderer (GFM tables/strikethrough/task lists + highlighted code blocks)
 * used by the blog and the markdown editor preview.
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={clsx(
        'prose prose-gray dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
