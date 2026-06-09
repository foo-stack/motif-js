import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';
import { evaluateLiteral, type ScopeLike } from './literal.js';

// @babel/traverse ships as CJS with a `default` interop under ESM.
const traverse = ((_traverse as unknown as { default?: typeof _traverse }).default ??
  _traverse) as typeof _traverse;

/**
 * Evaluate the first referenced occurrence of `name` in a full program, with
 * the real Babel scope (so binding/referencePaths are populated). Used to
 * exercise the const-binding path, which needs a scope.
 */
function evalIdentifierInProgram(src: string, name: string): ReturnType<typeof evaluateLiteral> {
  const file = parse(src, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  let result: ReturnType<typeof evaluateLiteral> | null = null;
  traverse(file, {
    Identifier(path) {
      if (result !== null) return;
      if (path.node.name === name && path.isReferencedIdentifier()) {
        result = evaluateLiteral(path.node, path.scope as unknown as ScopeLike);
      }
    },
  });
  if (result === null) throw new Error(`no referenced \`${name}\` found`);
  return result;
}

function exprFromSource(src: string): t.Expression {
  // Wrap as `const __ = <expr>;` so the parser sees a value position.
  const file = parse(`const __ = (${src});`, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  });
  const decl = file.program.body[0];
  if (!t.isVariableDeclaration(decl)) throw new Error('parse helper failed');
  const init = decl.declarations[0]!.init;
  if (init === null || init === undefined) throw new Error('parse helper: no init');
  return init;
}

describe('evaluateLiteral — primitives', () => {
  it('extracts string literals', () => {
    expect(evaluateLiteral(exprFromSource(`'hello'`))).toEqual({ ok: true, value: 'hello' });
  });

  it('extracts numeric literals', () => {
    expect(evaluateLiteral(exprFromSource(`42`))).toEqual({ ok: true, value: 42 });
  });

  it('extracts boolean literals', () => {
    expect(evaluateLiteral(exprFromSource(`true`))).toEqual({ ok: true, value: true });
    expect(evaluateLiteral(exprFromSource(`false`))).toEqual({ ok: true, value: false });
  });

  it('extracts null', () => {
    expect(evaluateLiteral(exprFromSource(`null`))).toEqual({ ok: true, value: null });
  });

  it('extracts negative numerics through UnaryExpression', () => {
    expect(evaluateLiteral(exprFromSource(`-4`))).toEqual({ ok: true, value: -4 });
    expect(evaluateLiteral(exprFromSource(`-1.5`))).toEqual({ ok: true, value: -1.5 });
  });

  it('extracts template literals with no expressions', () => {
    expect(evaluateLiteral(exprFromSource('`bar`'))).toEqual({ ok: true, value: 'bar' });
  });

  it('refuses template literals with expressions', () => {
    expect(evaluateLiteral(exprFromSource('`hello ${name}`'))).toEqual({ ok: false });
  });

  it('refuses identifier references without a scope', () => {
    expect(evaluateLiteral(exprFromSource(`name`))).toEqual({ ok: false });
  });
});

describe('evaluateLiteral — composite', () => {
  it('extracts plain object expressions', () => {
    expect(evaluateLiteral(exprFromSource(`{ base: '$2', md: '$4' }`))).toEqual({
      ok: true,
      value: { base: '$2', md: '$4' },
    });
  });

  it('extracts nested object expressions', () => {
    expect(evaluateLiteral(exprFromSource(`{ a: { b: 1 } }`))).toEqual({
      ok: true,
      value: { a: { b: 1 } },
    });
  });

  it('extracts array expressions', () => {
    expect(evaluateLiteral(exprFromSource(`['$2', '$4', '$6']`))).toEqual({
      ok: true,
      value: ['$2', '$4', '$6'],
    });
  });

  it('extracts sparse arrays as undefined slots', () => {
    expect(evaluateLiteral(exprFromSource(`['$2', , '$6']`))).toEqual({
      ok: true,
      value: ['$2', undefined, '$6'],
    });
  });

  it('refuses objects with computed keys', () => {
    expect(evaluateLiteral(exprFromSource(`{ [k]: 1 }`))).toEqual({ ok: false });
  });

  it('refuses objects whose values are non-static', () => {
    expect(evaluateLiteral(exprFromSource(`{ base: x }`))).toEqual({ ok: false });
  });

  it('refuses arrays with spread elements', () => {
    expect(evaluateLiteral(exprFromSource(`[1, ...rest]`))).toEqual({ ok: false });
  });
});

describe('evaluateLiteral — quoted-key responsive objects', () => {
  it('handles container-query keys (string literals)', () => {
    expect(evaluateLiteral(exprFromSource(`{ '@card.md': 'row' }`))).toEqual({
      ok: true,
      value: { '@card.md': 'row' },
    });
  });

  it('handles numeric keys', () => {
    expect(evaluateLiteral(exprFromSource(`{ 1: 'a' }`))).toEqual({ ok: true, value: { 1: 'a' } });
  });
});

describe('evaluateLiteral — const bindings and mutation', () => {
  it('extracts an unmutated const object via its binding', () => {
    const src = `const pad = { padding: 4 };\nkeep(pad);\n`;
    expect(evalIdentifierInProgram(src, 'pad')).toEqual({ ok: true, value: { padding: 4 } });
  });

  it('refuses a const object mutated by member assignment', () => {
    // `binding.constant` stays true here (the binding isn't reassigned), but
    // the object is mutated — baking { padding: 4 } would diverge from the
    // runtime's 8.
    const src = `const pad = { padding: 4 };\npad.padding = 8;\nkeep(pad);\n`;
    expect(evalIdentifierInProgram(src, 'pad')).toEqual({ ok: false });
  });

  it('refuses a const array mutated by push', () => {
    const src = `const arr = [1, 2];\narr.push(3);\nkeep(arr);\n`;
    expect(evalIdentifierInProgram(src, 'arr')).toEqual({ ok: false });
  });

  it('refuses a const object mutated by delete', () => {
    const src = `const o = { a: 1, b: 2 };\ndelete o.a;\nkeep(o);\n`;
    expect(evalIdentifierInProgram(src, 'o')).toEqual({ ok: false });
  });

  it('still extracts when the const is only read (member access, no write)', () => {
    const src = `const o = { a: 1 };\nconst x = o.a;\nkeep(o);\n`;
    expect(evalIdentifierInProgram(src, 'o')).toEqual({ ok: true, value: { a: 1 } });
  });
});
