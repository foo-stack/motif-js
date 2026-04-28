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
});
