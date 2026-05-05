import { Box, Globe, Layers, Palette, Smartphone, Zap } from './icons.js';

export function BentoFeatures() {
  return (
    <section className="section">
      <div className="h2">
        <div className="section__head">
          <div>
            <span className="section__eye">Why motif-js</span>
            <h2 className="section__title">
              A small set of <em>opinions</em>, well-tested.
            </h2>
          </div>
          <p className="section__sub">
            Cross-platform styling distilled into a layer that gets out of the way. Tokens that
            type-check, variants that compose, output that matches the platform.
          </p>
        </div>

        <div className="bento">
          <a className="bento__cell bento__cell--feature" href="/getting-started/web-and-native">
            <div>
              <div className="bento__icon">
                <Globe />
              </div>
              <div className="bento__title">Universal by design</div>
              <p className="bento__desc">
                One file. Web, iOS, Android, server. The same component, the same props, the same
                output — and the same TypeScript types.
              </p>
            </div>
            <div className="bento__platforms">
              <span className="bento__plat-pill">
                <Globe /> Web
              </span>
              <span className="bento__plat-pill">
                <Smartphone /> iOS
              </span>
              <span className="bento__plat-pill">
                <Smartphone /> Android
              </span>
              <span className="bento__plat-pill">
                <Box /> SSR
              </span>
              <span className="bento__plat-pill">
                <Box /> RSC
              </span>
            </div>
          </a>

          <div className="bento__cell bento__cell--med">
            <div>
              <div className="bento__icon">
                <Zap />
              </div>
              <div className="bento__title">Compiled, not interpreted</div>
              <p className="bento__desc">
                Styles resolve at build time to atomic classes or platform style objects. The
                runtime is a dedup cache, not a parser.
              </p>
            </div>
            <div className="bento__chart" aria-hidden="true">
              <div className="bento__bar" style={{ height: '20%' }} title="motif-js" />
              <div className="bento__bar" style={{ height: '32%' }} />
              <div className="bento__bar" style={{ height: '48%' }} />
              <div className="bento__bar" style={{ height: '60%' }} />
              <div className="bento__bar" style={{ height: '78%' }} />
              <div className="bento__bar bento__bar--lit" style={{ height: '100%' }} />
            </div>
          </div>

          <div className="bento__cell bento__cell--med">
            <div className="bento__icon">
              <Box />
            </div>
            <div className="bento__stat">
              <em>12 KB</em>
            </div>
            <p className="bento__desc">
              Gzipped on web. Tree-shakes per import — only the props you use ship to your bundle.
            </p>
          </div>

          <a className="bento__cell bento__cell--sm" href="/concepts/tokens">
            <div className="bento__icon">
              <Palette />
            </div>
            <div className="bento__title">Token-first</div>
            <p className="bento__desc">Define the scale once. Reference it everywhere.</p>
          </a>

          <a className="bento__cell bento__cell--sm" href="/concepts/variants">
            <div className="bento__icon">
              <Layers />
            </div>
            <div className="bento__title">Variants compose</div>
            <p className="bento__desc">Map, merge, and override like any other data.</p>
          </a>

          <a className="bento__cell bento__cell--sm" href="/concepts/responsive">
            <div className="bento__icon">
              <Smartphone />
            </div>
            <div className="bento__title">Platform-aware</div>
            <p className="bento__desc">
              Container queries, safe areas, and pseudo-states on every primitive.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
