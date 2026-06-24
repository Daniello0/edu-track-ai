import { renderReaderContent } from './reader-content.utils';

interface ContentAreaProps {
  content: string;
}

/**
 * Markdown reading area with Lora typography.
 */
export function ContentArea({ content }: ContentAreaProps) {
  return <div className="reader-body">{renderReaderContent(content)}</div>;
}
