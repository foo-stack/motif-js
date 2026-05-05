'use client';

import { useCallback, useState } from 'react';
import { ArrowRight, GitHub } from '../chrome/icons.js';
import { Check, Copy } from './icons.js';

const INSTALL_CMD = 'npm install @motif-js/react';

export function FinalCTA() {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(INSTALL_CMD).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section className="cta-final">
      <div className="h2">
        <h2>
          Ready to <em>ship</em>?
        </h2>
        <p>
          The introduction is a five-minute read. By the end, you'll have a styled component running
          on web and native, from the same source.
        </p>
        <div className="cta-final__btns">
          <a className="btn btn--primary" href="/getting-started/introduction">
            Start the tour <ArrowRight />
          </a>
          <button
            type="button"
            className="btn btn--copy-install"
            onClick={onCopy}
            title={copied ? 'Copied' : 'Copy install command'}
            aria-label="Copy install command"
          >
            <span className="npm-prefix">$</span>
            <span>{INSTALL_CMD}</span>
            <span className="copy-affordance">{copied ? <Check /> : <Copy />}</span>
          </button>
          <a
            className="btn btn--ghost"
            href="https://github.com/foo-stack/motif-js"
            rel="noreferrer"
          >
            <GitHub /> Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
