import type { ReactElement } from 'react';
import { Check, Sparkle } from './icons.js';

type Cell = 'ok' | 'no' | 'partial' | string;
interface Row {
  k: string;
  motif: Cell;
  a: Cell;
  b: Cell;
  c: Cell;
}

const rows: readonly Row[] = [
  { k: 'Universal (web + native)', motif: 'ok', a: 'no', b: 'partial', c: 'no' },
  { k: 'Compiled, atomic CSS', motif: 'ok', a: 'partial', b: 'ok', c: 'no' },
  { k: 'Type-safe tokens and variants', motif: 'ok', a: 'partial', b: 'partial', c: 'no' },
  { k: 'Compose without Babel/SWC plugin', motif: 'ok', a: 'ok', b: 'no', c: 'ok' },
  { k: 'Bundle size (gzipped)', motif: '12 KB', a: '12 KB', b: '0 KB', c: '8 KB' },
  { k: 'SSR / RSC first-paint', motif: 'ok', a: 'ok', b: 'ok', c: 'partial' },
  { k: 'Container queries', motif: 'ok', a: 'no', b: 'ok', c: 'no' },
  { k: 'Pseudo-state props on every primitive', motif: 'ok', a: 'partial', b: 'no', c: 'no' },
];

function cell(v: Cell): ReactElement {
  if (v === 'ok')
    return (
      <span className="ok">
        <Check />
      </span>
    );
  if (v === 'no') return <span className="no">—</span>;
  if (v === 'partial') return <span className="partial">Partial</span>;
  return <span>{v}</span>;
}

export function Comparison() {
  return (
    <section className="section">
      <div className="h2">
        <div className="section__head section__head--center">
          <div>
            <span className="section__eye">Compared</span>
            <h2 className="section__title">Honest, side-by-side.</h2>
            <p className="section__sub" style={{ margin: '12px auto 0' }}>
              We like the libraries we're compared against. Use whichever fits your team — but
              here's how motif-js stacks up.
            </p>
          </div>
        </div>

        <div className="compare">
          <div className="compare__head">
            <div className="compare__h">Feature</div>
            <div className="compare__h compare__h--motif">
              <Sparkle /> motif-js
            </div>
            <div className="compare__h">styled-components</div>
            <div className="compare__h">vanilla-extract</div>
            <div className="compare__h">CSS Modules</div>
          </div>
          {rows.map((r) => (
            <div className="compare__row" key={r.k}>
              <div className="compare__cell compare__cell--label">{r.k}</div>
              <div className="compare__cell compare__cell--motif">{cell(r.motif)}</div>
              <div className="compare__cell">{cell(r.a)}</div>
              <div className="compare__cell">{cell(r.b)}</div>
              <div className="compare__cell">{cell(r.c)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
