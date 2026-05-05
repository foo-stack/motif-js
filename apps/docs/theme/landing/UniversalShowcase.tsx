import { Check, Code, Globe, Smartphone } from './icons.js';

const lines: readonly { readonly t: string; readonly hl?: boolean }[] = [
  { t: "import { styled } from '@motif-js/react';" },
  { t: '' },
  { t: "export const Card = styled('section', {", hl: true },
  { t: '  base: {', hl: true },
  { t: "    bg: '$colors.surface.base',", hl: true },
  { t: "    p: '$space.6',", hl: true },
  { t: "    borderRadius: '$radii.lg',", hl: true },
  { t: "    boxShadow: '$shadows.md',", hl: true },
  { t: '  },', hl: true },
  { t: '  variants: {' },
  { t: '    elevated: {' },
  { t: "      true: { boxShadow: '$shadows.lg', transform: 'translateY(-2px)' }," },
  { t: '    },' },
  { t: '  },' },
  { t: '});' },
];

export function UniversalShowcase() {
  return (
    <section className="section">
      <div className="h2">
        <div className="showcase">
          <div className="showcase__copy">
            <span className="section__eye">The same code</span>
            <h3>
              Renders the same on every <em>surface</em>.
            </h3>
            <p>
              Write once, deploy to web, iOS, Android, or your favourite SSR framework. Motif's
              runtime emits atomic CSS for browsers and platform style objects for React Native —
              from the same input.
            </p>
            <p>
              No second place to keep in sync. No "we'll get to native later." No conditional
              imports.
            </p>
            <ul className="showcase__list">
              <li>
                <Check />
                <span>
                  <strong>Web:</strong> atomic classes, hashed and deduped, zero parsing at runtime.
                </span>
              </li>
              <li>
                <Check />
                <span>
                  <strong>iOS and Android:</strong> compiled <code>StyleSheet</code> objects, native
                  performance.
                </span>
              </li>
              <li>
                <Check />
                <span>
                  <strong>SSR and RSC:</strong> first-paint correct via{' '}
                  <code>SSRStyleCollector</code>, no flash of unstyled content.
                </span>
              </li>
              <li>
                <Check />
                <span>
                  <strong>Static analysis:</strong> tokens, variants, and theme references typecheck
                  end-to-end.
                </span>
              </li>
            </ul>
          </div>

          <div className="hero__code" style={{ margin: 0 }}>
            <div className="hero__code-tabs">
              <button type="button" className="hero__code-tab hero__code-tab--active">
                <Code /> Source
              </button>
              <button type="button" className="hero__code-tab">
                <Globe /> Web output
              </button>
              <button type="button" className="hero__code-tab">
                <Smartphone /> Native output
              </button>
            </div>
            <div className="hero__code-body">
              <pre>
                <code>
                  {lines.map((line, i) => (
                    // eslint-disable-next-line react/no-array-index-key -- code lines are static
                    <span key={i} className={`code-line${line.hl ? ' code-line--hl' : ''}`}>
                      {line.t || ' '}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            <div className="hero__code-foot">
              <span>Output:</span>
              <span className="hero__code-foot-platform">Web · atomic class</span>
              <span className="hero__code-foot-platform">Native · StyleSheet</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
