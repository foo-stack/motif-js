import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';
import { classifyJsxAttributes } from './analyze.js';
import { PRIMITIVE_INFO } from './primitives.js';
import { analyzeStripSafety, type BailReason } from './safety-analysis.js';

/**
 * Parse a JSX expression as a complete `JSXElement`. Returns the
 * opening element and the wrapping element so safety checks can
 * inspect both the attribute list and the children.
 */
function parseJsxElement(jsx: string): {
  opening: t.JSXOpeningElement;
  parent: t.JSXElement;
} {
  const file = parse(`const __ = ${jsx};`, { sourceType: 'module', plugins: ['jsx'] });
  const decl = file.program.body[0];
  if (!t.isVariableDeclaration(decl)) throw new Error('parse helper failed');
  const init = decl.declarations[0]!.init;
  if (!t.isJSXElement(init)) throw new Error('expected JSX element');
  return { opening: init.openingElement, parent: init };
}

function expectSafe(jsx: string, primitiveName: keyof typeof PRIMITIVE_INFO): void {
  const { opening, parent } = parseJsxElement(jsx);
  const primitive = PRIMITIVE_INFO[primitiveName];
  const analysis = classifyJsxAttributes(opening.attributes, undefined, primitive);
  const safety = analyzeStripSafety(opening, parent, primitive, analysis);
  expect(safety.safe, `expected safe, got bail '${safety.bailReason}'`).toBe(true);
  expect(safety.bailReason).toBeUndefined();
}

function expectBail(
  jsx: string,
  primitiveName: keyof typeof PRIMITIVE_INFO,
  reason: BailReason,
): void {
  const { opening, parent } = parseJsxElement(jsx);
  const primitive = PRIMITIVE_INFO[primitiveName];
  const analysis = classifyJsxAttributes(opening.attributes, undefined, primitive);
  const safety = analyzeStripSafety(opening, parent, primitive, analysis);
  expect(safety.safe).toBe(false);
  expect(safety.bailReason).toBe(reason);
}

describe('analyzeStripSafety — safe cases', () => {
  it('plain Box with literal style props is safe', () => {
    expectSafe(`<Box p={4} bg="red" />`, 'Box');
  });

  it('Box with literal-string children is safe', () => {
    expectSafe(`<Box p={4}>hello</Box>`, 'Box');
  });

  it('Box with an expression child (not a function) is safe', () => {
    expectSafe(`<Box p={4}>{name}</Box>`, 'Box');
  });

  it('Stack with default direction is safe', () => {
    expectSafe(`<Stack p={4} />`, 'Stack');
  });

  it('HStack with literal padding is safe', () => {
    expectSafe(`<HStack p={4} />`, 'HStack');
  });

  it('Text with literal fontSize is safe', () => {
    expectSafe(`<Text fontSize={16}>hi</Text>`, 'Text');
  });
});

describe('analyzeStripSafety — bailout cases', () => {
  it('bails on non-strippable primitive (Pressable)', () => {
    expectBail(`<Pressable p={4} />`, 'Pressable', 'not-strippable');
  });

  it('bails on non-strippable primitive (Image)', () => {
    expectBail(`<Image src="/x.png" />`, 'Image', 'not-strippable');
  });

  it('bails on dynamic style prop (partial-static)', () => {
    expectBail(`<Box p={4} bg={dynamic} />`, 'Box', 'non-static-classification');
  });

  it('bails on a spread attribute', () => {
    expectBail(`<Box p={4} {...rest} />`, 'Box', 'has-spread');
  });

  it('bails on `as` attribute', () => {
    expectBail(`<Box as="section" p={4} />`, 'Box', 'as-attribute');
  });

  it('bails on `ref` attribute', () => {
    expectBail(`<Box ref={r} p={4} />`, 'Box', 'ref-attribute');
  });

  it('bails on arrow-function-as-child', () => {
    expectBail(`<Box p={4}>{(s) => s.x}</Box>`, 'Box', 'function-as-child');
  });

  it('bails on FunctionExpression-as-child', () => {
    expectBail(`<Box p={4}>{function (s) { return s; }}</Box>`, 'Box', 'function-as-child');
  });
});
