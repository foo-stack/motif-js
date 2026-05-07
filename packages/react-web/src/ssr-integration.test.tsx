import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import {
  Box,
  Container,
  HStack,
  Image,
  Pressable,
  SSRStyleCollector,
  Text,
  Theme,
  ThemeProvider,
} from './index.js';
import { _resetStyleCacheForTesting } from './style-cache.js';

const lightTheme = {
  name: 'light',
  tokens: {
    colors: {
      surface: { base: '#ffffff', muted: '#f0f0f0', raised: '#fafafa' },
      text: { default: '#000000' },
      action: { primary: { bg: '#3b82f6', fg: '#ffffff' } },
    },
    space: { 1: 4, 2: 8, 4: 16, 6: 24, 8: 32 },
    radii: { md: 8 },
    sizes: { full: '100%' },
  },
};

beforeEach(() => {
  _resetStyleCacheForTesting();
});

afterEach(() => {
  _resetStyleCacheForTesting();
});

describe('SSR — full-tree renderToString', () => {
  it('captures media-query rules from a Box with a responsive object', () => {
    const collector = new SSRStyleCollector();
    const html = collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ base: '$2', md: '$4', lg: '$8' }}>responsive</Box>
        </ThemeProvider>,
      ),
    );
    expect(html).toContain('responsive');
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
    expect(collector.getCss()).toContain('@media (min-width: 1024px)');
  });

  it('captures media-query rules from the array syntax', () => {
    const collector = new SSRStyleCollector();
    collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={['$2', '$4', '$6']}>arr</Box>
        </ThemeProvider>,
      ),
    );
    expect(collector.getCss()).toContain('@media (min-width: 640px)');
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
  });

  it('captures media-query rules from the string DSL', () => {
    const collector = new SSRStyleCollector();
    collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p="md:$4 lg:$8">dsl</Box>
        </ThemeProvider>,
      ),
    );
    expect(collector.getCss()).toContain('@media (min-width: 768px)');
    expect(collector.getCss()).toContain('@media (min-width: 1024px)');
  });

  it('captures container-query rules', () => {
    const collector = new SSRStyleCollector();
    collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Container name="card">
            <Box p={{ '@card.md': '$4' }}>card</Box>
          </Container>
        </ThemeProvider>,
      ),
    );
    expect(collector.getCss()).toContain('@container card (min-width: 768px)');
  });

  it('captures pseudo-state rules from Pressable', () => {
    const collector = new SSRStyleCollector();
    collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Pressable
            _hover={{ opacity: 0.9 }}
            _focus={{ borderWidth: 2 }}
            _active={{ opacity: 0.8 }}
          >
            Press
          </Pressable>
        </ThemeProvider>,
      ),
    );
    expect(collector.getCss()).toContain(':hover');
    expect(collector.getCss()).toContain(':focus-visible');
    expect(collector.getCss()).toContain(':active');
  });

  it('emits ThemeProvider CSS-variable block in the HTML directly', () => {
    const collector = new SSRStyleCollector();
    const html = collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box>x</Box>
        </ThemeProvider>,
      ),
    );
    expect(html).toContain('data-motif-themes="root"');
    expect(html).toContain('--colors-surface-base: #ffffff');
    expect(html).toContain('data-theme="light"');
  });

  it('omits the runtime block when no theme registers fonts/root/reducedMotion', () => {
    const collector = new SSRStyleCollector();
    const html = collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box>x</Box>
        </ThemeProvider>,
      ),
    );
    expect(html).not.toContain('data-motif-themes="runtime"');
  });

  it('emits the runtime block when a theme declares fonts + root + reducedMotion', () => {
    const themed = {
      ...lightTheme,
      fonts: [
        {
          family: 'Inter',
          src: [{ url: '/fonts/inter.woff2', format: 'woff2' as const }],
          weight: '400 700',
          style: 'normal',
          display: 'swap' as const,
        },
      ],
      root: {
        background: '$colors.surface.base' as const,
        color: '$colors.text.default' as const,
        selectionBackground: '$colors.action.primary.bg' as const,
      },
      reducedMotion: 'guard' as const,
    };
    const collector = new SSRStyleCollector();
    const html = collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[themed]} active="light">
          <Box>x</Box>
        </ThemeProvider>,
      ),
    );
    expect(html).toContain('data-motif-themes="runtime"');
    expect(html).toContain('@font-face');
    expect(html).toContain('font-family: Inter');
    expect(html).toContain('background-color: var(--colors-surface-base)');
    expect(html).toContain('::selection');
    expect(html).toContain('@media (prefers-reduced-motion: reduce)');
  });

  it('puts collector CSS in <style data-motif-ssr> via getStyleTag', () => {
    const collector = new SSRStyleCollector();
    collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ md: '$4' }}>x</Box>
        </ThemeProvider>,
      ),
    );
    const tag = collector.getStyleTag();
    expect(tag).toMatch(/^<style data-motif-ssr>.*<\/style>$/s);
    expect(tag).toContain('@media (min-width: 768px)');
  });

  it('kitchen sink — every primitive composes without errors', () => {
    const collector = new SSRStyleCollector();
    const html = collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <HStack gap="$2">
            <Box p={['$2', '$4']}>arr</Box>
            <Box p="md:$4 lg:$8">dsl</Box>
            <Container name="x">
              <Box p={{ '@x.md': '$4' }}>cq</Box>
            </Container>
            <Pressable _hover={{ opacity: 0.9 }}>btn</Pressable>
            <Image src="/x.jpg" alt="x" w={50} h={50} />
            <Theme name="dark">
              <Text>nested</Text>
            </Theme>
          </HStack>
        </ThemeProvider>,
      ),
    );
    expect(html).toContain('arr');
    expect(html).toContain('dsl');
    expect(html).toContain('cq');
    expect(html).toContain('btn');
    expect(html).toContain('nested');
    expect(html).toContain('<img');
    const css = collector.getCss();
    expect(css).toContain('@media');
    expect(css).toContain('@container x');
    expect(css).toContain(':hover');
  });

  it('two collectors capture independently — no cross-request leakage', () => {
    // This proves the per-collector dedup contract: if global-only dedup
    // were in effect, the second collector would see an empty CSS string
    // because the first one already "claimed" the class names.
    const a = new SSRStyleCollector();
    const b = new SSRStyleCollector();

    a.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ md: '$4' }}>a</Box>
        </ThemeProvider>,
      ),
    );

    b.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ md: '$4' }}>b</Box>
        </ThemeProvider>,
      ),
    );

    expect(a.getCss()).toContain('@media (min-width: 768px)');
    expect(b.getCss()).toContain('@media (min-width: 768px)');
  });

  it('two collectors with disjoint rule sets do not bleed into each other', () => {
    const a = new SSRStyleCollector();
    const b = new SSRStyleCollector();

    a.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ md: '$4' }}>a</Box>
        </ThemeProvider>,
      ),
    );
    b.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ lg: '$8' }}>b</Box>
        </ThemeProvider>,
      ),
    );

    expect(a.getCss()).toContain('@media (min-width: 768px)');
    expect(a.getCss()).not.toContain('@media (min-width: 1024px)');
    expect(b.getCss()).toContain('@media (min-width: 1024px)');
    expect(b.getCss()).not.toContain('@media (min-width: 768px)');
  });

  it('no <style data-motif-style-cache> leaks into renderToString output', () => {
    // The browser-only injection element must never appear in SSR output.
    const collector = new SSRStyleCollector();
    const html = collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ md: '$4' }}>x</Box>
        </ThemeProvider>,
      ),
    );
    expect(html).not.toContain('data-motif-style-cache');
  });

  it('rendered HTML carries the generated class names so client styles match', () => {
    const collector = new SSRStyleCollector();
    const html = collector.collect(() =>
      renderToString(
        <ThemeProvider themes={[lightTheme]} active="light">
          <Box p={{ md: '$4' }}>x</Box>
        </ThemeProvider>,
      ),
    );
    // The collector's CSS uses `.m-<hash>`; the corresponding class must
    // appear on the rendered element so the rule actually matches.
    const classMatch = collector.getCss().match(/\.(m-[a-z0-9]+)/);
    expect(classMatch).not.toBeNull();
    const className = classMatch![1]!;
    expect(html).toContain(`class="${className}"`);
  });
});
