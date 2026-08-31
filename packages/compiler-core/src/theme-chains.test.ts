import { parse } from '@babel/parser';
import { describe, expect, it } from 'vitest';
import { findThemeChainCombos } from './theme-chains.js';

function combos(source: string): readonly string[] {
  const file = parse(source, { sourceType: 'module', plugins: ['jsx'] });
  return [...findThemeChainCombos(file.program.body)].sort();
}

describe('findThemeChainCombos', () => {
  it('returns empty for source with no <Theme>', () => {
    expect(combos(`const X = () => <Box />;`)).toEqual([]);
  });

  it('emits the literal chain for a single <Theme name="...">', () => {
    expect(combos(`const X = () => <Theme name="red"><Box/></Theme>;`)).toEqual(['red']);
  });

  it('emits both inner chains for nested <Theme>', () => {
    const src = `
      const X = () => (
        <Theme name="red">
          <Theme name="blue">
            <Box />
          </Theme>
        </Theme>
      );
    `;
    expect(combos(src)).toEqual(['red', 'red_blue']);
  });

  it('ignores ThemeProvider - its `active` is dynamic', () => {
    const src = `
      const X = () => (
        <ThemeProvider active="dark">
          <Theme name="red"><Box/></Theme>
        </ThemeProvider>
      );
    `;
    // Only the inner Theme contributes; the host build tool combines
    // with each registered base theme.
    expect(combos(src)).toEqual(['red']);
  });

  it('ignores dynamic <Theme name={value}>', () => {
    const src = `
      const X = ({ name }) => <Theme name={name}><Box/></Theme>;
    `;
    expect(combos(src)).toEqual([]);
  });

  it('walks through fragments and JSX expression containers', () => {
    const src = `
      const X = () => (
        <>
          <Theme name="red">
            {true && <Theme name="blue"><Box /></Theme>}
          </Theme>
        </>
      );
    `;
    expect(combos(src)).toEqual(['red', 'red_blue']);
  });

  it('walks through conditional expressions', () => {
    const src = `
      const X = ({ flag }) => flag
        ? <Theme name="red"><Box/></Theme>
        : <Theme name="blue"><Box/></Theme>;
    `;
    expect(combos(src)).toEqual(['blue', 'red']);
  });

  it('walks across multiple top-level components in the same file', () => {
    const src = `
      const A = () => <Theme name="red"><Box/></Theme>;
      const B = () => <Theme name="blue"><Box/></Theme>;
    `;
    expect(combos(src)).toEqual(['blue', 'red']);
  });

  it('allows Theme via member expression (`Motif.Theme`)', () => {
    const src = `
      const X = () => <Motif.Theme name="red"><Box/></Motif.Theme>;
    `;
    expect(combos(src)).toEqual(['red']);
  });

  it('dedupes repeated chains', () => {
    const src = `
      const A = () => <Theme name="red"><Box/></Theme>;
      const B = () => <Theme name="red"><Span/></Theme>;
    `;
    expect(combos(src)).toEqual(['red']);
  });
});
