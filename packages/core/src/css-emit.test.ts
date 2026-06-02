import { describe, expect, it } from 'vitest';
import { buildAtRulesCss, escapeCssValue, hashAtRules } from './css-emit.js';

describe('escapeCssValue', () => {
  it('leaves legitimate values byte-identical', () => {
    expect(escapeCssValue('#ffffff')).toBe('#ffffff');
    expect(escapeCssValue('var(--space-4)')).toBe('var(--space-4)');
    expect(escapeCssValue('cubic-bezier(0.4, 0, 0.2, 1)')).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(escapeCssValue('"liga" 1')).toBe('"liga" 1');
  });

  it('does not touch backslash so author CSS escapes keep working', () => {
    expect(escapeCssValue('\\2022')).toBe('\\2022');
  });

  it('hex-escapes the structural breakout characters', () => {
    expect(escapeCssValue('red; } body {')).toBe('red\\3b  \\7d  body \\7b ');
    // `<` is escaped (defeats `</style>`); a bare `>` is left intact.
    expect(escapeCssValue('</style>')).toBe('\\3c /style>');
    expect(escapeCssValue('">"')).toBe('">"');
  });
});

describe('buildAtRulesCss escaping', () => {
  it('neutralises a value that tries to close the rule block', () => {
    const css = buildAtRulesCss('m-abc', [
      { atRule: '', style: { content: '"x"; } body { display: none } .y {' } },
    ]);
    expect(css).not.toMatch(/}\s*body/);
    expect(css.match(/}/g)?.length ?? 0).toBe(1); // only the real terminator
  });
});

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

  // Regression: the old `|` / `||` join was not injective. These two
  // structurally-different rule sets both serialised to `m|||n|` under it
  // and collided on one class name; the JSON-encoded serialisation keeps
  // them distinct.
  it('does not collide when a selector contains the old delimiter chars', () => {
    const twoRules = hashAtRules([
      { atRule: 'm', style: {} },
      { atRule: 'n', style: {} },
    ]);
    const oneRule = hashAtRules([{ atRule: 'm|||n', style: {} }]);
    expect(twoRules).not.toBe(oneRule);
  });
});
