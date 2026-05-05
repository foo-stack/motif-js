import { ArrowRight, GitHub } from '../chrome/icons.js';
import { Copy } from './icons.js';

export function FinalCTA() {
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
          <button type="button" className="btn btn--copy-install" title="Copy install command">
            <span className="npm-prefix">$</span>
            <span>npm install @motif-js/react</span>
            <span className="copy-affordance">
              <Copy />
            </span>
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
