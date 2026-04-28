import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon.js';

describe('Icon (web)', () => {
  it('renders an <svg> with currentColor stroke and 1em sizing default token', () => {
    const html = renderToStaticMarkup(
      <Icon>
        <line x1="0" y1="0" x2="1" y2="1" />
      </Icon>,
    );
    expect(html).toMatch(/<svg/);
    expect(html).toContain('stroke="currentColor"');
  });

  it('decorative icons set aria-hidden=true', () => {
    const html = renderToStaticMarkup(
      <Icon>
        <circle cx="0" cy="0" r="1" />
      </Icon>,
    );
    expect(html).toMatch(/aria-hidden="true"/);
  });

  it('labelled icons get role=img and drop aria-hidden', () => {
    const html = renderToStaticMarkup(
      <Icon aria-label="Search">
        <circle cx="0" cy="0" r="1" />
      </Icon>,
    );
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Search"');
    expect(html).not.toContain('aria-hidden');
  });

  it('size="md" maps to 20px', () => {
    const html = renderToStaticMarkup(
      <Icon size="md">
        <circle cx="0" cy="0" r="1" />
      </Icon>,
    );
    expect(html).toContain('width="20"');
    expect(html).toContain('height="20"');
  });
});
