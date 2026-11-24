/**
 * Renderizador seguro e estilizado para o README.md vindo da API do GitHub.
 * Converte headings, listas, negrito, código inline, blocos de código
 * e extrai badges HTML (shields.io) em chips de vidro fumê elegantes.
 */
export default function MarkdownRenderer({ content = '' }) {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks = [];
  let inCodeBlock = false;
  let codeLines = [];
  let badgeBuffer = [];

  const flushBadges = (key) => {
    if (badgeBuffer.length > 0) {
      blocks.push({ type: 'badges', items: [...badgeBuffer], key });
      badgeBuffer = [];
    }
  };

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith('```')) {
      flushBadges(`b-${index}`);
      if (inCodeBlock) {
        blocks.push({ type: 'code', content: codeLines.join('\n'), key: `c-${index}` });
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      return;
    }

    // Detecta badges HTML shields.io no README do GitHub
    const imgAltMatch = trimmed.match(/<img[^>]*alt="([^"]+)"/i);
    if (imgAltMatch) {
      badgeBuffer.push(imgAltMatch[1]);
      return;
    }
    if (
      trimmed.startsWith('<div') ||
      trimmed.startsWith('</div') ||
      trimmed.startsWith('<a ') ||
      trimmed.startsWith('</a') ||
      trimmed.startsWith('<img ')
    ) {
      return;
    }

    flushBadges(`b-${index}`);

    if (!trimmed || trimmed === '---') {
      if (trimmed === '---') blocks.push({ type: 'hr', key: `hr-${index}` });
      return;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', text: trimmed.slice(2), key: `h1-${index}` });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', text: trimmed.slice(3), key: `h2-${index}` });
    } else if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', text: trimmed.slice(4), key: `h3-${index}` });
    } else if (/^[-*]\s+/.test(trimmed)) {
      blocks.push({ type: 'li', text: trimmed.replace(/^[-*]\s+/, ''), key: `li-${index}` });
    } else if (/^\d+\.\s+/.test(trimmed)) {
      blocks.push({ type: 'li', text: trimmed.replace(/^\d+\.\s+/, ''), key: `oli-${index}` });
    } else {
      blocks.push({ type: 'p', text: trimmed, key: `p-${index}` });
    }
  });

  flushBadges('b-end');

  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="rounded border border-amethyst-400/30 bg-amethyst-600/15 px-1.5 py-0.5 font-mono text-xs text-amethyst-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={idx}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-amethyst-400/60 underline-offset-2 transition-colors hover:text-amethyst-300"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="space-y-3 text-sm leading-relaxed text-mist">
      {blocks.map((block) => {
        if (block.type === 'h1') {
          return (
            <h3 key={block.key} className="font-serif text-2xl font-medium text-white">
              {renderInline(block.text)}
            </h3>
          );
        }
        if (block.type === 'h2') {
          return (
            <h4
              key={block.key}
              className="pt-2 font-mono text-xs uppercase tracking-[0.2em] text-amethyst-300"
            >
              {renderInline(block.text)}
            </h4>
          );
        }
        if (block.type === 'h3') {
          return (
            <h5 key={block.key} className="pt-1 text-sm font-medium text-white/90">
              {renderInline(block.text)}
            </h5>
          );
        }
        if (block.type === 'hr') {
          return <hr key={block.key} className="border-white/10" />;
        }
        if (block.type === 'badges') {
          return (
            <div key={block.key} className="flex flex-wrap gap-2 py-1">
              {block.items.map((label) => (
                <span
                  key={label}
                  className="glass-pill-idle rounded-full px-3 py-1 font-mono text-[11px] text-white/90"
                >
                  {label}
                </span>
              ))}
            </div>
          );
        }
        if (block.type === 'li') {
          return (
            <div key={block.key} className="flex items-start gap-2.5 pl-1">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amethyst-400 shadow-[0_0_8px_rgba(192,132,252,0.9)]" />
              <p>{renderInline(block.text)}</p>
            </div>
          );
        }
        if (block.type === 'code') {
          return (
            <pre
              key={block.key}
              className="overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-3.5 font-mono text-xs text-amethyst-300"
            >
              <code>{block.content}</code>
            </pre>
          );
        }
        return <p key={block.key}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
