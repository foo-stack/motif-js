import { describe, expect, it } from 'vitest';
import { buildAtRulesCss, hashAtRules } from './css-emit.js';

describe('buildAtRulesCss', () => {
  it('wraps a media at-rule around the class selector', () => {
    const css = buildAtRulesCss('m-abc', [
      { atRule: '@media (min-width: 768px)', style: { padding: 16 } },
    ]);
    expect(css).toBe('@media (min-width: 768px) { .m-abc { padding: 16px; } }');
  });

  it('emits a bare class selector when atRule is the empty-string sentinel (1.6)', () => {
    // The base class block — emitted *without* an at-rule wrapper so it
    // sits at the same specificity (0,0,1,0) as its breakpoint
    // overrides.
    const css = buildAtRulesCss('m-abc', [{ atRule: '', style: { display: 'flex' } }]);
    expect(css).toBe('.m-abc { display: flex; }');
  });

  it('preserves source order: base block first, then media, then container', () => {
    // Source order matters: same-specificity rules cascade by appearance,
    // so base must precede the overrides.
    const css = buildAtRulesCss('m-abc', [
      { atRule: '', style: { display: 'block' } },
      { atRule: '@media (min-width: 768px)', style: { display: 'flex' } },
      { atRule: '@container card (min-width: 1024px)', style: { display: 'grid' } },
    ]);
    expect(css.split('\n')).toEqual([
      '.m-abc { display: block; }',
      '@media (min-width: 768px) { .m-abc { display: flex; } }',
      '@container card (min-width: 1024px) { .m-abc { display: grid; } }',
    ]);
  });
});

describe('hashAtRules', () => {
  it('produces deterministic hashes including the empty-atRule sentinel', () => {
    // The base block must contribute to the hash so two boxes with the
    // same overrides but different bases get distinct class names.
    const a = hashAtRules([
      { atRule: '', style: { display: 'block' } },
      { atRule: '@media (min-width: 768px)', style: { display: 'flex' } },
    ]);
    const b = hashAtRules([
      { atRule: '', style: { display: 'inline-block' } },
      { atRule: '@media (min-width: 768px)', style: { display: 'flex' } },
    ]);
    expect(a).not.toBe(b);
    expect(a).toMatch(/^m-[a-z0-9]+$/);
  });
});
