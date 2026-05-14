import { parse } from '@babel/parser';
import * as t from '@babel/types';
import { describe, expect, it } from 'vitest';
import { bindingForJsxName, findMotifBindings } from './imports.js';

function programBody(src: string): readonly t.Statement[] {
  return parse(src, { sourceType: 'module', plugins: ['jsx'] }).program.body;
}

describe('findMotifBindings', () => {
  it('picks up named imports from motif sources', () => {
    const body = programBody(`import { Box, Stack } from '@usemotif/react';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('Box')).toEqual({
      localName: 'Box',
      source: '@usemotif/react',
      importedName: 'Box',
    });
    expect(bindings.get('Stack')).toBeDefined();
  });

  it('handles aliased imports', () => {
    const body = programBody(`import { Box as MotifBox } from '@usemotif/react';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('MotifBox')).toEqual({
      localName: 'MotifBox',
      source: '@usemotif/react',
      importedName: 'Box',
    });
    expect(bindings.has('Box')).toBe(false);
  });

  it('ignores non-motif sources', () => {
    const body = programBody(`import { Box } from '@chakra-ui/react';`);
    expect(findMotifBindings(body).size).toBe(0);
  });

  it('ignores non-primitive named exports', () => {
    const body = programBody(`import { Theme, Container } from '@usemotif/react';`);
    const bindings = findMotifBindings(body);
    expect(bindings.size).toBe(0);
  });

  it('also tracks imports from @usemotif/react-native', () => {
    const body = programBody(`import { Box } from '@usemotif/react-native';`);
    expect(findMotifBindings(body).get('Box')).toBeDefined();
  });

  it('also tracks imports from the meta-package usemotif', () => {
    const body = programBody(`import { Box } from 'usemotif';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('Box')).toEqual({
      localName: 'Box',
      source: 'usemotif',
      importedName: 'Box',
    });
  });

  // Back-compat for the v2 names. Drop in @usemotif/compiler-core@2.0.0.
  it('still tracks imports from the v2 @motif-js/react for back-compat', () => {
    const body = programBody(`import { Box } from '@motif-js/react';`);
    const bindings = findMotifBindings(body);
    expect(bindings.get('Box')).toEqual({
      localName: 'Box',
      source: '@motif-js/react',
      importedName: 'Box',
    });
  });

  it('still tracks imports from the v2 @motif-js/react-native for back-compat', () => {
    const body = programBody(`import { Box } from '@motif-js/react-native';`);
    expect(findMotifBindings(body).get('Box')).toBeDefined();
  });

  // v1 back-compat window closed. The v1 DOM-bindings name no longer
  // resolves to a motif source, so the JSX call sites at that import
  // site won't be extracted. Documented in the v2→v3 migration guide.
  it('does NOT track imports from the v1 @motif-js/react-web (back-compat dropped)', () => {
    const body = programBody(`import { Box } from '@motif-js/react-web';`);
    expect(findMotifBindings(body).size).toBe(0);
  });
});

describe('bindingForJsxName', () => {
  it('matches a JSX identifier against the binding map', () => {
    const body = programBody(`import { Box } from '@usemotif/react';`);
    const bindings = findMotifBindings(body);
    const ident = t.jsxIdentifier('Box');
    expect(bindingForJsxName(ident, bindings)?.importedName).toBe('Box');
  });

  it('returns undefined for unknown identifiers', () => {
    const bindings = findMotifBindings(programBody(`import { Box } from '@usemotif/react';`));
    expect(bindingForJsxName(t.jsxIdentifier('Other'), bindings)).toBeUndefined();
  });

  it('returns undefined for member-expression JSX names', () => {
    const bindings = findMotifBindings(programBody(`import { Box } from '@usemotif/react';`));
    const member = t.jsxMemberExpression(t.jsxIdentifier('Motif'), t.jsxIdentifier('Box'));
    expect(bindingForJsxName(member, bindings)).toBeUndefined();
  });
});
