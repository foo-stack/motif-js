import { transformSync } from '@babel/core';
import { describe, expect, it } from 'vitest';
import motifBabelPlugin, { type MotifBabelOptions } from './index.js';

interface TransformResult {
  readonly code: string;
  readonly css: string;
}

function transform(source: string, options: MotifBabelOptions = {}): TransformResult {
  const cssChunks: string[] = [];
  const result = transformSync(source, {
    babelrc: false,
    configFile: false,
    filename: 'test.tsx',
    plugins: [
      [
        motifBabelPlugin,
        {
          ...options,
          onCss: (css) => {
            cssChunks.push(css);
            options.onCss?.(css);
          },
        } satisfies MotifBabelOptions,
      ],
    ],
    parserOpts: { plugins: ['jsx', 'typescript'] },
    generatorOpts: { compact: false, retainLines: false },
  });
  return { code: result?.code ?? '', css: cssChunks.join('\n') };
}

describe('motif babel plugin — extraction', () => {
  it('bakes literal style props into a style attribute', () => {
    const { code, css } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={4} bg="red" />;
    `);
    expect(code).not.toMatch(/\bp=\{4\}/);
    expect(code).not.toMatch(/bg="red"/);
    expect(code).toContain('style');
    expect(code).toContain('padding: 4');
    expect(code).toContain('backgroundColor: "red"');
    expect(css).toBe('');
  });

  it('emits a className and CSS for responsive props', () => {
    const { code, css } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={{ base: '$2', md: '$4' }} />;
    `);
    expect(code).toMatch(/className="m-[a-z0-9]+"/);
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toContain('--space-4');
  });

  it('leaves dynamic call sites untouched', () => {
    const { code, css } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = ({ size }) => <Box p={size} />;
    `);
    expect(code).toContain('p={size}');
    expect(css).toBe('');
  });

  it('handles partial-static — keeps dynamic props on JSX, bakes static ones', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = ({ brand }) => <Box p={4} bg={brand} />;
    `);
    expect(code).not.toMatch(/\bp=\{4\}/);
    expect(code).toContain('bg={brand}');
    expect(code).toContain('padding: 4');
  });

  it('bails on spread', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = ({ rest }) => <Box p={4} {...rest} />;
    `);
    expect(code).toContain('p={4}');
    expect(code).toContain('...rest');
  });

  it('does not touch non-motif components', () => {
    const { code } = transform(`
      import { Box } from '@chakra-ui/react';
      const X = () => <Box p={4} />;
    `);
    expect(code).toContain('p={4}');
  });

  it('respects aliased imports', () => {
    const { code } = transform(`
      import { Box as MotifBox } from '@motif-js/react-web';
      const X = () => <MotifBox p={4} />;
    `);
    expect(code).not.toMatch(/p=\{4\}/);
    expect(code).toContain('padding: 4');
  });

  it('merges baked style with an existing literal style attribute (user wins)', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={4} style={{ padding: 99 }} />;
    `);
    // User's `padding: 99` must remain (it's the override per Box semantics).
    expect(code).toContain('padding: 99');
  });

  it('appends a generated className to an existing className', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={{ base: '$2', md: '$4' }} className="user" />;
    `);
    expect(code).toMatch(/className="m-[a-z0-9]+ user"/);
  });

  it('extracts named container queries', () => {
    const { code, css } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={{ base: '$2', '@card.lg': '$8' }} />;
    `);
    expect(code).toMatch(/className="m-[a-z0-9]+"/);
    expect(css).toContain('@container card (min-width: 1024px)');
  });

  it('processes Stack and HStack identically', () => {
    const { code } = transform(`
      import { Stack, HStack } from '@motif-js/react-web';
      const X = () => <><Stack p={4} /><HStack m={2} /></>;
    `);
    expect(code).not.toMatch(/p=\{4\}/);
    expect(code).not.toMatch(/m=\{2\}/);
  });

  it('does nothing when target is native (handled by Metro shim)', () => {
    const { code, css } = transform(
      `
      import { Box } from '@motif-js/react-native';
      const X = () => <Box p={4} />;
    `,
      { target: 'native' },
    );
    expect(code).toContain('p={4}');
    expect(css).toBe('');
  });

  it('invokes onCss exactly once per file with non-empty CSS', () => {
    let calls = 0;
    transform(
      `
      import { Box } from '@motif-js/react-web';
      const X = () => <><Box p={{ base: '$1', md: '$2' }} /><Box p={{ base: '$3', md: '$4' }} /></>;
    `,
      {
        onCss: () => {
          calls += 1;
        },
      },
    );
    expect(calls).toBe(1);
  });

  it('does not call onCss when nothing was extracted', () => {
    let calls = 0;
    transform(
      `
      import { Box } from '@motif-js/react-web';
      const X = ({ x }) => <Box p={x} />;
    `,
      {
        onCss: () => {
          calls += 1;
        },
      },
    );
    expect(calls).toBe(0);
  });
});

describe('motif babel plugin — pseudo-state extraction', () => {
  it('extracts a static _hover bag into a className + pseudo CSS', () => {
    const { code, css } = transform(`
      import { Pressable } from '@motif-js/react-web';
      const X = () => <Pressable _hover={{ opacity: 0.9 }} />;
    `);
    expect(code).not.toMatch(/_hover=/);
    expect(code).toMatch(/className="m-[a-z0-9]+"/);
    expect(css).toContain(':hover');
    expect(css).toContain('opacity: 0.9');
  });

  it('combines at-rule + pseudo class names with a space', () => {
    const { code, css } = transform(`
      import { Pressable } from '@motif-js/react-web';
      const X = () => <Pressable p={{ base: '$2', md: '$4' }} _hover={{ opacity: 0.9 }} />;
    `);
    expect(code).toMatch(/className="m-[a-z0-9]+ m-[a-z0-9]+"/);
    expect(css).toContain('@media (min-width: 768px)');
    expect(css).toContain(':hover');
  });

  it('rewrites & inside selectors to the generated class', () => {
    const { code, css } = transform(`
      import { Pressable } from '@motif-js/react-web';
      const X = () => <Pressable _disabled={{ opacity: 0.5 }} />;
    `);
    expect(code).toMatch(/className="m-[a-z0-9]+"/);
    expect(css).toContain('[aria-disabled="true"]');
    expect(css).toContain(':disabled');
    expect(css).not.toMatch(/&\[aria-disabled/);
  });

  it('leaves a dynamic _hover bag on the JSX', () => {
    const { code } = transform(`
      import { Pressable } from '@motif-js/react-web';
      const X = ({ hov }) => <Pressable _hover={hov} />;
    `);
    expect(code).toContain('_hover={hov}');
  });
});

describe('motif babel plugin — wrapper stripping', () => {
  it('replaces fully-static <Box> with <div>', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={4} bg="red" />;
    `);
    expect(code).toContain('<div');
    expect(code).not.toMatch(/<Box\b/);
  });

  it('replaces fully-static <Text> with <span>', () => {
    const { code } = transform(`
      import { Text } from '@motif-js/react-web';
      const X = () => <Text fontSize={16}>hi</Text>;
    `);
    expect(code).toContain('<span');
    expect(code).toContain('</span>');
    expect(code).not.toMatch(/<Text\b/);
  });

  it('replaces <HStack> with <div> + display:flex / flexDirection:row', () => {
    const { code } = transform(`
      import { HStack } from '@motif-js/react-web';
      const X = () => <HStack p={4} />;
    `);
    expect(code).toContain('<div');
    expect(code).not.toMatch(/<HStack\b/);
    expect(code).toContain('display: "flex"');
    expect(code).toContain('flexDirection: "row"');
    expect(code).toContain('padding: 4');
  });

  it('replaces <VStack> with <div> + display:flex / flexDirection:column', () => {
    const { code } = transform(`
      import { VStack } from '@motif-js/react-web';
      const X = () => <VStack m={2} />;
    `);
    expect(code).toContain('<div');
    expect(code).not.toMatch(/<VStack\b/);
    expect(code).toContain('display: "flex"');
    expect(code).toContain('flexDirection: "column"');
  });

  it('rewrites <Stack direction="row"> → <div display:flex flexDirection:row>', () => {
    const { code } = transform(`
      import { Stack } from '@motif-js/react-web';
      const X = () => <Stack direction="row" p={4} />;
    `);
    expect(code).toContain('<div');
    expect(code).not.toMatch(/<Stack\b/);
    expect(code).not.toMatch(/direction=/);
    expect(code).toContain('flexDirection: "row"');
  });

  it('uses Stack default direction=column when no direction prop', () => {
    const { code } = transform(`
      import { Stack } from '@motif-js/react-web';
      const X = () => <Stack p={4} />;
    `);
    expect(code).toContain('<div');
    expect(code).toContain('flexDirection: "column"');
  });

  it('does NOT strip <Box> when `as` is set', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box as="section" p={4} />;
    `);
    expect(code).toMatch(/<Box\b/);
    expect(code).toContain('as="section"');
  });

  it('does NOT strip <Box> with a dynamic style prop (partial-static)', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = ({ size }) => <Box p={4} bg={size} />;
    `);
    expect(code).toMatch(/<Box\b/);
  });

  it('does NOT strip <Box> with spread (dynamic)', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = ({ rest }) => <Box p={4} {...rest} />;
    `);
    expect(code).toMatch(/<Box\b/);
  });

  it('does NOT strip <Pressable> (pseudo-states / event-handler runtime needed)', () => {
    const { code } = transform(`
      import { Pressable } from '@motif-js/react-web';
      const X = () => <Pressable p={4} bg="red" />;
    `);
    expect(code).toMatch(/<Pressable\b/);
    expect(code).not.toContain('<button');
  });

  it('strips with children (closing tag rewritten)', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={4}>hello</Box>;
    `);
    expect(code).toContain('<div');
    expect(code).toContain('</div>');
    expect(code).not.toMatch(/<Box\b/);
    expect(code).not.toMatch(/<\/Box>/);
  });

  it('does NOT strip when classification is partial-static (Stack with dynamic direction)', () => {
    const { code } = transform(`
      import { Stack } from '@motif-js/react-web';
      const X = ({ dir }) => <Stack direction={dir} p={4} />;
    `);
    expect(code).toMatch(/<Stack\b/);
  });
});
