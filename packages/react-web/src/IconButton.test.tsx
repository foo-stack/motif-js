import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { IconButton } from './IconButton.js';

describe('IconButton (web)', () => {
  it('renders a button with required aria-label', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="Add">
        <span>+</span>
      </IconButton>,
    );
    expect(html).toMatch(/<button/);
    expect(html).toMatch(/aria-label="Add"/);
  });

  it('renders the icon prop when provided', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="Add" icon={<span data-icon="plus">+</span>} />,
    );
    expect(html).toContain('data-icon="plus"');
  });

  it('size=md sets a 36px square', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="x">
        <span>x</span>
      </IconButton>,
    );
    expect(html).toContain('width:36px');
    expect(html).toContain('height:36px');
  });

  it('disabled emits the native disabled attr', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="x" disabled>
        <span>x</span>
      </IconButton>,
    );
    expect(html).toMatch(/disabled/);
  });

  it('marks the inner icon as aria-hidden', () => {
    const html = renderToStaticMarkup(
      <IconButton aria-label="x">
        <span>X</span>
      </IconButton>,
    );
    expect(html).toMatch(/aria-hidden="true"/);
  });
});
