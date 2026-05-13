import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Link } from './Link.js';

describe('Link (web)', () => {
  it('renders <a href> by default', () => {
    const html = renderToStaticMarkup(<Link href="/x">link</Link>);
    expect(html).toMatch(/<a[^>]*href="\/x"/);
  });

  it('target=_blank auto-injects rel=noopener noreferrer', () => {
    const html = renderToStaticMarkup(
      <Link href="https://x" target="_blank">
        ext
      </Link>,
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('noopener noreferrer');
  });

  it('explicit rel wins over the auto default', () => {
    const html = renderToStaticMarkup(
      <Link href="https://x" target="_blank" rel="external">
        ext
      </Link>,
    );
    expect(html).toContain('rel="external"');
    expect(html).not.toContain('noopener');
  });

  it('underline=always sets text-decoration:underline', () => {
    const html = renderToStaticMarkup(
      <Link href="/x" underline="always">
        x
      </Link>,
    );
    expect(html).toMatch(/text-decoration:\s*underline/);
  });

  it('underline=hover starts with no underline', () => {
    const html = renderToStaticMarkup(
      <Link href="/x" underline="hover">
        x
      </Link>,
    );
    expect(html).toMatch(/text-decoration:\s*none/);
  });
});
