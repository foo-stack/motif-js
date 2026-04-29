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

  it('hoists native styles into StyleSheet.create when target is native', () => {
    const { code, css } = transform(
      `
      import { Box } from '@motif-js/react-native';
      const X = () => <Box p={4} />;
    `,
      { target: 'native' },
    );
    expect(code).not.toMatch(/\bp=\{4\}/);
    expect(code).toContain('StyleSheet');
    expect(code).toContain('_motifStyles');
    expect(code).toContain('padding: 4');
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

describe('motif babel plugin — native StyleSheet hoisting', () => {
  function transformNative(source: string): { code: string } {
    const result = transformSync(source, {
      babelrc: false,
      configFile: false,
      filename: 'test.tsx',
      plugins: [[motifBabelPlugin, { target: 'native' } satisfies MotifBabelOptions]],
      parserOpts: { plugins: ['jsx', 'typescript'] },
      generatorOpts: { compact: false, retainLines: false },
    });
    return { code: result?.code ?? '' };
  }

  it('hoists a single Box style into _motifStyles.id0', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      const X = () => <Box p={4} />;
    `);
    expect(code).toContain('import { StyleSheet as _motifStyleSheet } from "react-native"');
    expect(code).toMatch(/const _motifStyles = _motifStyleSheet\.create\(\{/);
    expect(code).toMatch(/id0:\s*\{[^}]*padding:\s*4/);
    expect(code).toMatch(/style=\{_motifStyles\.id0\}/);
  });

  it('hoists multiple call sites with sequential ids', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      const X = () => <><Box p={4} /><Box m={8} /></>;
    `);
    expect(code).toMatch(/style=\{_motifStyles\.id0\}/);
    expect(code).toMatch(/style=\{_motifStyles\.id1\}/);
    expect(code).toMatch(/id0:\s*\{[^}]*padding:\s*4/);
    expect(code).toMatch(/id1:\s*\{[^}]*margin:\s*8/);
  });

  it('skips token-ref values (theme is dynamic on native)', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      const X = () => <Box bg="$colors.brand.500" />;
    `);
    // Token ref → no literal extracted → no hoisting.
    expect(code).toContain('bg="$colors.brand.500"');
    expect(code).not.toContain('_motifStyles');
  });

  it('merges with an existing user style as an array (user wins)', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      const X = () => <Box p={4} style={userStyle} />;
    `);
    // Hoisted entry first, user entry last → user overrides.
    expect(code).toMatch(/style=\{\[_motifStyles\.id0,\s*userStyle\]\}/);
  });

  it('prepends to an existing array style', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      const X = () => <Box p={4} style={[a, b]} />;
    `);
    expect(code).toMatch(/style=\{\[_motifStyles\.id0,\s*a,\s*b\]\}/);
  });

  it('leaves dynamic call sites alone on native', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      const X = ({ size }) => <Box p={size} />;
    `);
    expect(code).toContain('p={size}');
    expect(code).not.toContain('_motifStyles');
  });

  it('does not hoist when nothing was extracted', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      const X = () => <Box bg="$colors.brand.500" />;
    `);
    expect(code).not.toContain('StyleSheet');
    expect(code).not.toContain('_motifStyles');
  });

  it('inserts the hoisted StyleSheet declaration after all imports', () => {
    const { code } = transformNative(`
      import { Box } from '@motif-js/react-native';
      import other from 'somewhere';
      const X = () => <Box p={4} />;
    `);
    const lastImportIdx = code.lastIndexOf("from 'somewhere'");
    const ssImportIdx = code.indexOf('_motifStyleSheet');
    const declIdx = code.indexOf('_motifStyles =');
    expect(lastImportIdx).toBeGreaterThanOrEqual(0);
    expect(ssImportIdx).toBeGreaterThan(lastImportIdx);
    expect(declIdx).toBeGreaterThan(ssImportIdx);
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

describe('motif babel plugin — motion + animation extraction', () => {
  it('bakes a literal `transition` string into inline style', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box transition="opacity 200ms ease" />;
    `);
    expect(code).not.toMatch(/transition=/);
    expect(code).toContain('transition: "opacity 200ms ease"');
  });

  it('resolves a `transition` object literal with defaults', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box transition={{ property: 'opacity' }} />;
    `);
    expect(code).toContain('transition: "opacity 200ms ease"');
  });

  it('expands `animation="<name>"` to a var-based transition string', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box animation="bouncy" />;
    `);
    expect(code).not.toMatch(/animation=/);
    expect(code).toContain('var(--motif-anim-bouncy-duration)');
    expect(code).toContain('var(--motif-anim-bouncy-easing)');
  });

  it('respects `animateOnly` to limit the transition property list', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box animation="normal" animateOnly={['transform']} />;
    `);
    expect(code).toContain('transform var(--motif-anim-normal-duration)');
    expect(code).not.toMatch(/animateOnly=/);
  });

  it('emits an [data-motif-state="exiting"] pseudo rule for `exitStyle`', () => {
    const { code, css } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box exitStyle={{ opacity: 0 }} />;
    `);
    expect(code).not.toMatch(/exitStyle=/);
    expect(code).toMatch(/className="m-[a-z0-9]+"/);
    expect(css).toContain('[data-motif-state="exiting"]');
    expect(css).toContain('opacity: 0');
  });

  it('leaves `enterStyle` on the JSX (runtime-only overlay)', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box opacity={1} enterStyle={{ opacity: 0 }} />;
    `);
    expect(code).toContain('enterStyle={{');
    // opacity={1} still extracted; the wrapper stays because enterStyle
    // blocks stripping (Box owns the first-paint overlay machinery).
    expect(code).toMatch(/<Box\b/);
    expect(code).toContain('opacity: 1');
  });

  it('strips the wrapper for transition-only call sites', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box transition="opacity 200ms ease" />;
    `);
    // Transition reduces to a plain inline style — works on any element,
    // so the wrapper can collapse to <div>.
    expect(code).toContain('<div');
    expect(code).not.toMatch(/<Box\b/);
  });

  it('does NOT strip when `enterStyle` is present', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box enterStyle={{ opacity: 0 }} />;
    `);
    expect(code).toMatch(/<Box\b/);
  });
});

describe('motif babel plugin — theme-chain pre-generation', () => {
  function chainsFrom(source: string): readonly string[] {
    const observed = new Set<string>();
    transform(source, {
      onThemeChains: (combos) => {
        for (const c of combos) observed.add(c);
      },
    });
    return [...observed].sort();
  }

  it('emits the inner Theme chain ignoring the dynamic provider active', () => {
    const src = `
      import { ThemeProvider, Theme } from '@motif-js/react-web';
      const X = ({ active }) => (
        <ThemeProvider active={active}>
          <Theme name="red"><div /></Theme>
        </ThemeProvider>
      );
    `;
    expect(chainsFrom(src)).toEqual(['red']);
  });

  it('emits both layers for a nested <Theme>', () => {
    const src = `
      import { Theme } from '@motif-js/react-web';
      const X = () => (
        <Theme name="red">
          <Theme name="blue"><div /></Theme>
        </Theme>
      );
    `;
    expect(chainsFrom(src)).toEqual(['red', 'red_blue']);
  });

  it('skips dynamic Theme.name', () => {
    const src = `
      import { Theme } from '@motif-js/react-web';
      const X = ({ name }) => <Theme name={name}><div /></Theme>;
    `;
    expect(chainsFrom(src)).toEqual([]);
  });

  it('does not call the callback when no chains are observed', () => {
    let called = false;
    transform(
      `
        import { Box } from '@motif-js/react-web';
        const X = () => <Box p={4} />;
      `,
      {
        onThemeChains: () => {
          called = true;
        },
      },
    );
    expect(called).toBe(false);
  });
});

describe('motif babel plugin — styled() variant extraction', () => {
  it('expands a base-only styled() into the underlying primitive', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Big = styled(Box, { base: { p: 8 } });
      const X = () => <Big />;
    `);
    // `<Big />` → `<Box p={8} />` → wrapper-stripped to `<div style={...}>`.
    expect(code).toContain('<div');
    expect(code).not.toMatch(/<Big\b/);
    expect(code).toContain('padding: 8');
  });

  it('selects the matching variant case at compile time', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Btn = styled(Box, { variants: { size: { sm: { p: 2 }, lg: { p: 8 } } } });
      const X = () => <Btn size="sm" />;
    `);
    expect(code).toContain('padding: 2');
    expect(code).not.toMatch(/size="sm"/);
    expect(code).not.toMatch(/<Btn\b/);
  });

  it('layers compoundVariants on top when every matcher is satisfied', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Btn = styled(Box, {
        base: { p: 1 },
        variants: {
          size: { sm: { p: 2 }, lg: { p: 8 } },
          intent: { primary: { fontSize: 12 } },
        },
        compoundVariants: [
          { size: 'lg', intent: 'primary', css: { fontWeight: 700 } },
        ],
      });
      const X = () => <Btn size="lg" intent="primary" />;
    `);
    expect(code).toContain('padding: 8');
    expect(code).toContain('fontSize: 12');
    expect(code).toContain('fontWeight: 700');
  });

  it('respects defaultVariants when the call site omits a variant', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Btn = styled(Box, {
        variants: { size: { sm: { p: 2 }, lg: { p: 8 } } },
        defaultVariants: { size: 'lg' },
      });
      const X = () => <Btn />;
    `);
    expect(code).toContain('padding: 8');
  });

  it('caller-supplied style props win over variant-derived defaults', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Big = styled(Box, { base: { p: 8 } });
      const X = () => <Big p={2} />;
    `);
    // The merged config sets `padding: 8`, but the caller's `p={2}`
    // overrides it. After extraction the inline style ends up as
    // `padding: 2`.
    expect(code).toContain('padding: 2');
    expect(code).not.toContain('padding: 8');
  });

  it('leaves dynamic variant call-sites at runtime', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Btn = styled(Box, { variants: { size: { sm: { p: 2 } } } });
      const X = ({ s }) => <Btn size={s} />;
    `);
    // Element name should stay `<Btn>` so the runtime resolver picks
    // up the dynamic variant at render time.
    expect(code).toMatch(/<Btn\b/);
    expect(code).toContain('size={s}');
  });

  it('leaves the call site alone when the styled() config is non-literal', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Btn = styled(Box, dynamicConfig);
      const X = () => <Btn size="sm" />;
    `);
    expect(code).toMatch(/<Btn\b/);
    expect(code).toContain('size="sm"');
  });

  it('handles aliased styled imports', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled as s } from '@motif-js/react';
      const Big = s(Box, { base: { p: 8 } });
      const X = () => <Big />;
    `);
    expect(code).toContain('padding: 8');
    expect(code).not.toMatch(/<Big\b/);
  });

  it('passes through non-variant attrs unchanged', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      import { styled } from '@motif-js/react';
      const Btn = styled(Box, { variants: { size: { sm: { p: 2 } } } });
      const X = () => <Btn size="sm" id="hello" data-x="y" />;
    `);
    expect(code).toContain('id="hello"');
    expect(code).toContain('data-x="y"');
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

  it('does NOT strip <Box> when a `ref` attribute is set', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = ({ ref }) => <Box ref={ref} p={4} />;
    `);
    expect(code).toMatch(/<Box\b/);
    expect(code).toContain('ref={ref}');
  });

  it('does NOT strip <Box> with a function-as-child', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={4}>{(state) => state.x}</Box>;
    `);
    expect(code).toMatch(/<Box\b/);
  });

  it('does NOT strip <Box> with a FunctionExpression child', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = () => <Box p={4}>{function (s) { return s; }}</Box>;
    `);
    expect(code).toMatch(/<Box\b/);
  });

  it('strips <Box> with a regular expression child (not a function)', () => {
    const { code } = transform(`
      import { Box } from '@motif-js/react-web';
      const X = ({ name }) => <Box p={4}>{name}</Box>;
    `);
    expect(code).toContain('<div');
    expect(code).not.toMatch(/<Box\b/);
  });
});
