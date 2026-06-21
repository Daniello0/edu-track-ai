/**
 * Converts simple markdown-like content to React nodes (UI mock only).
 */
export function renderReaderContent(content: string): React.ReactNode {
  return content.split('\n\n').map((block, index) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={index} className="reader-content-heading">
          {block.replace('## ', '')}
        </h2>
      );
    }

    if (block.startsWith('### ')) {
      return (
        <h3 key={index} className="reader-content-subheading">
          {block.replace('### ', '')}
        </h3>
      );
    }

    if (block.startsWith('> ')) {
      return (
        <blockquote key={index} className="reader-content-quote">
          {block.replace('> ', '')}
        </blockquote>
      );
    }

    if (block.startsWith('- ')) {
      const items = block.split('\n').map((line) => line.replace(/^-\s*/, ''));
      return (
        <ul key={index} className="reader-content-list">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{item.replace(/\*\*/g, '')}</li>
          ))}
        </ul>
      );
    }

    if (/^\d+\.\s/.test(block)) {
      const items = block
        .split('\n')
        .map((line) => line.replace(/^\d+\.\s*/, ''));
      return (
        <ol key={index} className="reader-content-list">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{item.replace(/\*\*/g, '')}</li>
          ))}
        </ol>
      );
    }

    return (
      <p key={index} className="reader-content-paragraph">
        {block.replace(/\*\*(.*?)\*\*/g, '$1')}
      </p>
    );
  });
}
