'use client';

import { useRef, useState } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { Check, Copy, FileText } from '@motif-js/icons';

export type CodeBlockShellProps = ComponentPropsWithoutRef<'pre'> & {
  /** Lifted from the fenced-block metastring by rehype-shiki. */
  'data-filename'?: string;
  filename?: string;
};

const COPIED_DELAY_MS = 1400;

/**
 * Wraps the `<pre>` emitted by rehype-shiki with the design's `.code`
 * chrome — a head bar with a filename or tabs + copy action, a body
 * with the highlighted Shiki output. The Shiki classes on the inner
 * `<pre>` carry through so the per-token color CSS variables keep
 * resolving against `[data-theme]`.
 */
export function CodeBlockShell(props: CodeBlockShellProps) {
  const { className, children, ...rest } = props;
  const filename = props['data-filename'] ?? props.filename;
  const innerProps = { ...rest };
  delete innerProps['data-filename'];
  delete innerProps.filename;

  const innerRef = useRef<HTMLPreElement | null>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    const text = innerRef.current?.textContent ?? '';
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPIED_DELAY_MS);
  };

  return (
    <div className="code">
      <div className="code__head">
        <div className="code__filename">
          <FileText />
          {filename ?? 'example.tsx'}
        </div>
        <div className="code__actions">
          <button
            type="button"
            className={'code__action' + (copied ? ' code__action--copied' : '')}
            onClick={onCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
          >
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="code__body">
        <pre
          ref={innerRef}
          className={className}
          {...(innerProps as ComponentPropsWithoutRef<'pre'>)}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}
