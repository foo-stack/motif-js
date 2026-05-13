import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';
import { bindingForJsxName, findMotifBindings } from './imports.js';

function programBody(src: string): readonly t.Statement[] {
  return parse(src, { sourceType: 'module', plugins: ['jsx'] }).program.body;
}

describe('findMotifBindings', () => {
  it('picks up named imports from motif sources', () => {
    const body = programBody(`import { Box, Stack } from '@motif-js/react';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('Box')).toEqual({
      localName: 'Box',
      source: '@motif-js/react',
      importedName: 'Box',
    });
    expect(bindings.get('Stack')).toBeDefined();
  });

  it('handles aliased imports', () => {
    const body = programBody(`import { Box as MotifBox } from '@motif-js/react';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('MotifBox')).toEqual({
      localName: 'MotifBox',
      source: '@motif-js/react',
      importedName: 'Box',
    });
    expect(bindings.has('Box')).toBe(false);
  });

  it('ignores non-motif sources', () => {
    const body = programBody(`import { Box } from '@chakra-ui/react';`);
    expect(findMotifBindings(body).size).toBe(0);
  });

  it('ignores non-primitive named exports', () => {
    const body = programBody(`import { Theme, Container } from '@motif-js/react';`);
    const bindings = findMotifBindings(body);
    expect(bindings.size).toBe(0);
  });

  it('also tracks imports from @motif-js/react-native', () => {
    const body = programBody(`import { Box } from '@motif-js/react-native';`);
    expect(findMotifBindings(body).get('Box')).toBeDefined();
  });

  it('also tracks imports from the v2 meta-package motif-js', () => {
    const body = programBody(`import { Box } from 'motif-js';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('Box')).toEqual({
      localName: 'Box',
      source: 'motif-js',
      importedName: 'Box',
    });
  });

  // Back-compat for the v1 name. Drop in compiler-core@3.0.0.
  it('still tracks imports from the v1 @motif-js/react-web for back-compat', () => {
    const body = programBody(`import { Box } from '@motif-js/react-web';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('Box')).toEqual({
      localName: 'Box',
      source: '@motif-js/react-web',
      importedName: 'Box',
    });
  });
});

describe('bindingForJsxName', () => {
  it('matches a JSX identifier against the binding map', () => {
    const body = programBody(`import { Box } from '@motif-js/react';`);
    const bindings = findMotifBindings(body);
    const ident = t.jsxIdentifier('Box');
    expect(bindingForJsxName(ident, bindings)?.importedName).toBe('Box');
  });

  it('returns undefined for unknown identifiers', () => {
    const bindings = findMotifBindings(programBody(`import { Box } from '@motif-js/react';`));
    expect(bindingForJsxName(t.jsxIdentifier('Other'), bindings)).toBeUndefined();
  });

  it('returns undefined for member-expression JSX names', () => {
    const bindings = findMotifBindings(programBody(`import { Box } from '@motif-js/react';`));
    const member = t.jsxMemberExpression(t.jsxIdentifier('Motif'), t.jsxIdentifier('Box'));
    expect(bindingForJsxName(member, bindings)).toBeUndefined();
  });
});
