import { createElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  AspectRatio,
  Center,
  Flex,
  Grid,
  SafeArea,
  Spacer,
  Wrap,
  ZStack,
} from './layout-extras.js';

describe('layout-extras (web)', () => {
  it('Spacer renders a flex:1 box', () => {
    const html = renderToStaticMarkup(<Spacer />);
    expect(html).toMatch(/flex:\s*1/);
  });

  it('Center sets flex centering', () => {
    const html = renderToStaticMarkup(<Center>x</Center>);
    expect(html).toMatch(/display:\s*flex/);
    expect(html).toMatch(/align-items:\s*center/);
    expect(html).toMatch(/justify-content:\s*center/);
  });

  it('Wrap sets flex-wrap', () => {
    const html = renderToStaticMarkup(<Wrap>x</Wrap>);
    expect(html).toMatch(/flex-wrap:\s*wrap/);
  });

  it('AspectRatio sets aspect-ratio CSS', () => {
    const html = renderToStaticMarkup(<AspectRatio ratio={16 / 9}>x</AspectRatio>);
    expect(html).toMatch(/aspect-ratio/);
  });

  it('Grid columns shorthand expands to grid-template-columns repeat', () => {
    const html = renderToStaticMarkup(<Grid columns={3}>x</Grid>);
    expect(html).toMatch(/display:\s*grid/);
    expect(html).toMatch(/grid-template-columns:\s*repeat\(3,\s*1fr\)/);
  });

  it('Grid templateColumns wins over columns when both set', () => {
    const html = renderToStaticMarkup(
      <Grid columns={3} templateColumns="1fr 2fr">
        x
      </Grid>,
    );
    expect(html).toContain('1fr 2fr');
    expect(html).not.toMatch(/repeat\(3/);
  });

  it('Flex defaults to row when direction not set; honours direction prop', () => {
    const a = renderToStaticMarkup(<Flex>x</Flex>);
    expect(a).toMatch(/display:\s*flex/);
    const b = renderToStaticMarkup(<Flex direction="column">x</Flex>);
    expect(b).toMatch(/flex-direction:\s*column/);
  });

  it('SafeArea on web is a styled Box (no-op vs RN insets)', () => {
    const html = renderToStaticMarkup(<SafeArea bg="#f00">x</SafeArea>);
    expect(html).toMatch(/<div/);
    expect(html).toContain('#f00');
  });

  it('ZStack establishes a single grid cell and wraps each child', () => {
    const html = renderToStaticMarkup(
      <ZStack>
        <span>a</span>
        <span>b</span>
      </ZStack>,
    );
    expect(html).toMatch(/display:\s*grid/);
    expect(html).toContain('grid-template-areas');
    // Both children should land in the same cell (their wrappers carry it).
    expect((html.match(/grid-area:\s*stack/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  // #154 - the per-child wrappers must be real grid items, not
  // `display: contents`. A contents box generates no box, so its
  // `grid-area` is ignored and the children auto-place into separate
  // implicit rows instead of overlapping - defeating ZStack entirely.
  it('ZStack child wrappers are grid items, not display:contents', () => {
    const html = renderToStaticMarkup(
      <ZStack>
        <span>a</span>
        <span>b</span>
      </ZStack>,
    );
    // The container is the only `display: grid`; no wrapper may be
    // `display: contents` (which would nullify its grid-area).
    expect(html).not.toMatch(/display:\s*contents/);
    // Each child's wrapper still carries the shared cell.
    expect((html.match(/grid-area:\s*stack/g) ?? []).length).toBe(2);
  });

  // #201 - the wrapper must carry the child's own key, not the running index.
  // Index keys make React reuse the wrong DOM node on reorder/insert/delete
  // and lose child state.
  // <Box>{<>{[<Box key=...>, ...]}</>}</Box> - dig out the wrapper elements.
  function wrapperKeys(tree: ReactElement): Array<string | null> {
    const fragment = (tree.props as { children: ReactElement }).children;
    const wrappers = (fragment.props as { children: ReactElement[] }).children;
    return wrappers.map((w) => w.key);
  }

  it('ZStack preserves each child key on its wrapper', () => {
    const tree = ZStack({
      children: [
        createElement('span', { key: 'alpha' }, 'a'),
        createElement('span', { key: 'beta' }, 'b'),
      ],
    }) as ReactElement;
    expect(wrapperKeys(tree)).toEqual(['alpha', 'beta']);
  });

  it('ZStack falls back to a prefixed index key for unkeyed children', () => {
    const tree = ZStack({
      children: [createElement('span', null, 'a'), createElement('span', null, 'b')],
    }) as ReactElement;
    expect(wrapperKeys(tree)).toEqual(['z0', 'z1']);
  });
});
