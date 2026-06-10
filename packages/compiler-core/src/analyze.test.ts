import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';
import { classifyJsxAttributes } from './analyze.js';

function jsxAttrs(jsx: string): readonly (t.JSXAttribute | t.JSXSpreadAttribute)[] {
  const file = parse(`const __ = ${jsx};`, { sourceType: 'module', plugins: ['jsx'] });
  const decl = file.program.body[0];
  if (!t.isVariableDeclaration(decl)) throw new Error('parse helper failed');
  const init = decl.declarations[0]!.init;
  if (!t.isJSXElement(init)) throw new Error('expected JSX element');
  return init.openingElement.attributes;
}

describe('classifyJsxAttributes', () => {
  it('classifies all-literal style props as static', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box p={4} bg="red" />`));
    expect(result.classification).toBe('static');
    expect(result.staticProps).toHaveLength(2);
    expect(result.staticProps.map((p) => [p.name, p.value])).toEqual([
      ['p', 4],
      ['bg', 'red'],
    ]);
    expect(result.dynamicProps).toHaveLength(0);
  });

  it('treats string-literal attributes (no braces) as static', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box bg="red" />`));
    expect(result.classification).toBe('static');
    expect(result.staticProps[0]).toMatchObject({ name: 'bg', value: 'red' });
  });

  it('classifies a dynamic identifier prop as dynamic', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box p={size} />`));
    expect(result.classification).toBe('dynamic');
    expect(result.staticProps).toHaveLength(0);
    expect(result.dynamicProps).toHaveLength(1);
    expect(result.dynamicProps[0]!.name).toBe('p');
  });

  it('classifies a mix as partial-static', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box p={4} bg={brand} />`));
    expect(result.classification).toBe('partial-static');
    expect(result.staticProps.map((p) => p.name)).toEqual(['p']);
    expect(result.dynamicProps.map((p) => p.name)).toEqual(['bg']);
  });

  it('forces dynamic when a spread is present', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box p={4} {...rest} />`));
    expect(result.classification).toBe('dynamic');
    expect(result.hasSpread).toBe(true);
  });

  it('separates pass-through (non-style) props', () => {
    const result = classifyJsxAttributes(
      jsxAttrs(`<Box p={4} onClick={fn} aria-label="x" data-foo="y" />`),
    );
    expect(result.staticProps.map((p) => p.name)).toEqual(['p']);
    expect(result.passThrough.map((p) => p.name)).toContain('onClick');
    expect(result.passThrough.map((p) => p.name)).toContain('aria-label');
    expect(result.passThrough.map((p) => p.name)).toContain('data-foo');
  });

  it('extracts responsive object literals as static', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box p={{ base: '$2', md: '$4' }} />`));
    expect(result.classification).toBe('static');
    expect(result.staticProps[0]!.value).toEqual({ base: '$2', md: '$4' });
  });

  it('extracts array responsive literals as static', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box p={['$2', '$4', '$6']} />`));
    expect(result.classification).toBe('static');
    expect(result.staticProps[0]!.value).toEqual(['$2', '$4', '$6']);
  });

  it('classifies an element with no style props at all as static (no-op)', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box onClick={fn} />`));
    expect(result.classification).toBe('static');
    expect(result.staticProps).toHaveLength(0);
    expect(result.dynamicProps).toHaveLength(0);
  });

  it('extracts a literal _hover bag into pseudoStateProps', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Pressable _hover={{ opacity: 0.9 }} />`));
    expect(result.classification).toBe('static');
    expect(result.pseudoStateProps).toHaveLength(1);
    expect(result.pseudoStateProps[0]).toMatchObject({
      name: '_hover',
      pseudo: ':hover',
      style: { opacity: 0.9 },
    });
  });

  it('maps each pseudo prop to its CSS selector', () => {
    const result = classifyJsxAttributes(
      jsxAttrs(
        `<Pressable _hover={{ opacity: 0.9 }} _focus={{ borderWidth: 2 }} _active={{ opacity: 0.8 }} _disabled={{ opacity: 0.5 }} />`,
      ),
    );
    expect(result.pseudoStateProps.map((p) => [p.name, p.pseudo])).toEqual([
      ['_hover', ':hover'],
      ['_focus', ':focus-visible'],
      ['_active', ':active'],
      ['_disabled', '&:disabled, &[aria-disabled="true"]'],
    ]);
  });

  it('treats a dynamic _hover value as dynamic, not pseudo-state', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Pressable _hover={hoverStyle} />`));
    expect(result.classification).toBe('dynamic');
    expect(result.pseudoStateProps).toHaveLength(0);
    expect(result.dynamicProps.map((p) => p.name)).toContain('_hover');
  });

  it('combines static style props with static pseudo-state into classification=static', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Pressable p={4} _hover={{ opacity: 0.9 }} />`));
    expect(result.classification).toBe('static');
    expect(result.staticProps).toHaveLength(1);
    expect(result.pseudoStateProps).toHaveLength(1);
  });

  it('extracts a literal `transition` string into motionProps', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box transition="opacity 200ms ease" />`));
    expect(result.classification).toBe('static');
    expect(result.motionProps).toEqual([{ name: 'transition', value: 'opacity 200ms ease' }]);
  });

  it('extracts a literal `transition` object literal', () => {
    const result = classifyJsxAttributes(
      jsxAttrs(`<Box transition={{ property: 'opacity', duration: '200ms' }} />`),
    );
    expect(result.classification).toBe('static');
    expect(result.motionProps[0]).toMatchObject({
      name: 'transition',
      value: { property: 'opacity', duration: '200ms' },
    });
  });

  it('extracts `enterStyle` / `exitStyle` object literals into motionProps', () => {
    const result = classifyJsxAttributes(
      jsxAttrs(`<Box enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0.5 }} />`),
    );
    expect(result.motionProps.map((m) => m.name)).toEqual(['enterStyle', 'exitStyle']);
  });

  it('extracts `animation` + `animateOnly` literals', () => {
    const result = classifyJsxAttributes(
      jsxAttrs(`<Box animation="bouncy" animateOnly={['transform', 'opacity']} />`),
    );
    expect(result.motionProps).toEqual([
      { name: 'animation', value: 'bouncy' },
      { name: 'animateOnly', value: ['transform', 'opacity'] },
    ]);
  });

  it('treats a dynamic `transition` value as dynamic, not motion', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box transition={maybeTransition} />`));
    expect(result.classification).toBe('dynamic');
    expect(result.motionProps).toHaveLength(0);
    expect(result.dynamicProps.map((p) => p.name)).toContain('transition');
  });

  it('rejects malformed motion-prop shapes (e.g. number for animation)', () => {
    const result = classifyJsxAttributes(jsxAttrs(`<Box animation={5} />`));
    expect(result.motionProps).toHaveLength(0);
    expect(result.dynamicProps.map((p) => p.name)).toContain('animation');
  });
});
