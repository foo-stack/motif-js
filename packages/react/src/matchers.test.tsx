import { beforeAll, describe, expect, it } from 'vitest';
import { motifMatchers } from '@usemotif/test-utils';
import { createWebAdapter } from './web-adapter.js';

beforeAll(() => {
  expect.extend(motifMatchers);
});

describe('matchers — toHaveStyle / toHaveStyleAt', () => {
  const adapter = createWebAdapter();

  it('toHaveStyle passes for matching inline style', () => {
    const out = adapter.render({ name: 'p=$4', primitive: 'Box', props: { p: '$4' } });
    expect(out).toHaveStyle({ padding: 16 });
  });

  it('toHaveStyle fails when a value is wrong', () => {
    const out = adapter.render({ name: 'p=$4', primitive: 'Box', props: { p: '$4' } });
    expect(() => expect(out).toHaveStyle({ padding: 999 })).toThrow(/padding/);
  });

  it('toHaveStyle does subset matching — extra keys are fine', () => {
    const out = adapter.render({
      name: 'p+bg',
      primitive: 'Box',
      props: { p: '$4', bg: '#fff' },
    });
    expect(out).toHaveStyle({ padding: 16 });
    expect(out).toHaveStyle({ backgroundColor: '#fff' });
  });

  it('toHaveStyleAt routes @media scopes to the media bucket', () => {
    const out = adapter.render({
      name: 'p={{ md: $8 }}',
      primitive: 'Box',
      props: { p: { md: '$8' } },
    });
    expect(out).toHaveStyleAt('@media (min-width: 768px)', { padding: 32 });
  });

  it('toHaveStyleAt routes @container scopes to the container bucket', () => {
    const out = adapter.render({
      name: 'p={{ @card.md: $8 }}',
      primitive: 'Box',
      props: { p: { '@card.md': '$8' } },
    });
    expect(out).toHaveStyleAt('@container card (min-width: 768px)', { padding: 32 });
  });

  it('toHaveStyleAt routes :pseudo scopes to the pseudo bucket', () => {
    const out = adapter.render({
      name: 'pressable hover',
      primitive: 'Pressable',
      props: { _hover: { opacity: 0.9 } },
    });
    expect(out).toHaveStyleAt(':hover', { opacity: 0.9 });
  });

  it('toHaveStyleAt fails clearly when the scope is missing', () => {
    const out = adapter.render({ name: 'p=$4', primitive: 'Box', props: { p: '$4' } });
    expect(() => expect(out).toHaveStyleAt('@media (min-width: 768px)', { padding: 32 })).toThrow(
      /mediaRules/,
    );
  });

  it('.not.toHaveStyle inverts correctly', () => {
    const out = adapter.render({ name: 'p=$4', primitive: 'Box', props: { p: '$4' } });
    expect(out).not.toHaveStyle({ padding: 999 });
  });
});
