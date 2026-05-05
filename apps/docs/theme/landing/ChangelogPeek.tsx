import { ArrowRight } from '../chrome/icons.js';

export function ChangelogPeek() {
  return (
    <section className="section">
      <div className="h2">
        <div className="section__head">
          <div>
            <span className="section__eye">Recent</span>
            <h2 className="section__title">
              Shipped <em>this week</em>.
            </h2>
          </div>
          <p className="section__sub">
            Motion, theming, compiler work landed on April 30. Read the full changelog for the why
            behind every change.
          </p>
        </div>

        <div className="changelog" style={{ margin: 0, maxWidth: 'none' }}>
          <div className="changelog__entry" style={{ paddingTop: 0 }}>
            <div>
              <div className="changelog__date">Apr 30, 2026</div>
              <div className="changelog__version">v1.1.2</div>
              <span className="changelog__tag">Latest</span>
            </div>
            <div>
              <div className="changelog__row">
                <span className="changelog__chip changelog__chip--fix">Fix</span>
              </div>
              <h3 className="changelog__title">
                SWC compiler emits aggregated CSS via virtual module
              </h3>
              <div className="changelog__body">
                <p>
                  Apps using the SWC plugin no longer have to wire the emitted style sheet by hand.
                  The publish pipeline also rewrites <code>workspace:*</code> deps cleanly.
                </p>
              </div>
            </div>
          </div>

          <div className="changelog__entry">
            <div>
              <div className="changelog__date">Apr 30, 2026</div>
              <div className="changelog__version">v1.1.0</div>
            </div>
            <div>
              <div className="changelog__row">
                <span className="changelog__chip changelog__chip--feat">Feature</span>
              </div>
              <h3 className="changelog__title">Motion, theming, and compiler stabilisation</h3>
              <div className="changelog__body">
                <p>
                  Web and native mount/unmount transitions, Reanimated UI-thread driver, chainable
                  sub-themes, fallback variants, <code>@motif-js/reset</code>, icons v2 with 1,932
                  lucide glyphs, the Phase G compiler extension pass.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <a className="btn btn--ghost" href="/changelog">
            See full changelog <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
