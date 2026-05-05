import { useCallback, useState } from 'react';
import { Check, Copy, File } from './icons.js';

export interface CodeBlockTab {
  label: string;
  code: string;
  filename?: string;
}

export interface CodeBlockProps {
  filename?: string;
  code?: string;
  tabs?: CodeBlockTab[];
  highlightLines?: readonly number[];
  showCopy?: boolean;
}

export function CodeBlock({
  filename,
  code,
  tabs,
  highlightLines = [],
  showCopy = true,
}: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const tabSet = tabs && tabs.length > 0;
  const activeIndex = tabSet ? Math.min(activeTab, tabs.length - 1) : 0;
  const current = tabSet ? tabs[activeIndex] : { code: code ?? '', filename };
  const lines = (current?.code ?? '').split('\n');

  const onCopy = useCallback(() => {
    const text = current?.code ?? '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [current?.code]);

  const selectTab = useCallback((i: number) => () => setActiveTab(i), []);

  return (
    <div className="code">
      <div className="code__head">
        {tabSet ? (
          <div className="code__tabs" role="tablist">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                className={`code__tab${i === activeIndex ? ' code__tab--active' : ''}`}
                onClick={selectTab(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="code__filename">
            <File />
            {current?.filename ?? 'example.tsx'}
          </div>
        )}
        {showCopy ? (
          <div className="code__actions">
            <button
              type="button"
              className={`code__action${copied ? ' code__action--copied' : ''}`}
              onClick={onCopy}
            >
              {copied ? <Check /> : <Copy />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        ) : null}
      </div>
      <div className="code__body">
        <pre>
          <code>
            {lines.map((ln, i) => (
              <span
                // eslint-disable-next-line react/no-array-index-key -- code lines are positional and have no stable id.
                key={i}
                className={`code-line${highlightLines.includes(i) ? ' code-line--hl' : ''}`}
              >
                {ln || ' '}
                {'\n'}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
