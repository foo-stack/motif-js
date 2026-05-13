import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { _resetStyleCacheForTesting } from './style-cache.js';
import { Image } from './Image.js';
import { Box } from './Box.js';

let container: HTMLElement;
let root: Root;

function render(node: React.ReactNode): void {
  act(() => {
    root.render(node);
  });
}

beforeEach(() => {
  _resetStyleCacheForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  document.body.removeChild(container);
  _resetStyleCacheForTesting();
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

describe('Image — simple case (no placeholder/fallback)', () => {
  it('renders a single <img> with src and alt', () => {
    render(<Image src="/x.jpg" alt="test" />);
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(1);
    expect(imgs[0]?.getAttribute('src')).toBe('/x.jpg');
    expect(imgs[0]?.getAttribute('alt')).toBe('test');
  });

  it('threads loading and decoding attributes through', () => {
    render(<Image src="/x.jpg" alt="" loading="lazy" decoding="async" />);
    const img = container.querySelector('img')!;
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
  });

  it('applies Box style props as inline style', () => {
    render(<Image src="/x.jpg" alt="" w={120} h={80} objectFit="cover" />);
    const img = container.querySelector('img')!;
    expect(img.style.width).toBe('120px');
    expect(img.style.height).toBe('80px');
    expect(img.style.objectFit).toBe('cover');
  });

  it('passes through srcSet and sizes', () => {
    render(<Image src="/x.jpg" alt="" srcSet="/x@1.jpg 1x, /x@2.jpg 2x" sizes="100vw" />);
    const img = container.querySelector('img')!;
    expect(img.getAttribute('srcset')).toBe('/x@1.jpg 1x, /x@2.jpg 2x');
    expect(img.getAttribute('sizes')).toBe('100vw');
  });
});

describe('Image — wrapped case (placeholder)', () => {
  it('renders a wrapper Box with the img inside when placeholder is given', () => {
    render(
      <Image
        src="/x.jpg"
        alt=""
        w={100}
        h={100}
        placeholder={<Box bg="#eee" w="100%" h="100%" />}
      />,
    );
    // Top-level should be a div (the wrapper), not an img
    expect(container.firstElementChild?.tagName).toBe('DIV');
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
  });

  it('shows the placeholder while the image is loading (opacity 0 on img)', () => {
    render(
      <Image
        src="/x.jpg"
        alt=""
        w={100}
        h={100}
        placeholder={<Box data-testid="ph" bg="#eee" w="100%" h="100%" />}
      />,
    );
    const ph = container.querySelector('[data-testid="ph"]');
    expect(ph).not.toBeNull();
    const img = container.querySelector('img')!;
    expect(img.style.opacity).toBe('0');
  });

  it('hides the placeholder and reveals the img after onLoad fires', () => {
    render(
      <Image
        src="/x.jpg"
        alt=""
        w={100}
        h={100}
        placeholder={<Box data-testid="ph" bg="#eee" w="100%" h="100%" />}
      />,
    );
    const img = container.querySelector('img')!;
    act(() => {
      img.dispatchEvent(new Event('load'));
    });
    expect(container.querySelector('[data-testid="ph"]')).toBeNull();
    expect(img.style.opacity).toBe('1');
  });

  it('falls back to the placeholder on error if no fallback is given', () => {
    render(
      <Image
        src="/missing.jpg"
        alt=""
        w={100}
        h={100}
        placeholder={<Box data-testid="ph" bg="#eee" w="100%" h="100%" />}
      />,
    );
    const img = container.querySelector('img')!;
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
    expect(container.querySelector('[data-testid="ph"]')).not.toBeNull();
    // img stays at opacity 0 since it never loaded
    expect(img.style.opacity).toBe('0');
  });
});

describe('Image — wrapped case (fallback distinct from placeholder)', () => {
  it('shows the fallback (not placeholder) on error when both are set', () => {
    render(
      <Image
        src="/missing.jpg"
        alt=""
        w={100}
        h={100}
        placeholder={<Box data-testid="ph" w="100%" h="100%" />}
        fallback={<Box data-testid="fb" w="100%" h="100%" />}
      />,
    );
    const img = container.querySelector('img')!;
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
    expect(container.querySelector('[data-testid="ph"]')).toBeNull();
    expect(container.querySelector('[data-testid="fb"]')).not.toBeNull();
  });

  it('still shows the placeholder during loading even when a fallback is set', () => {
    render(
      <Image
        src="/x.jpg"
        alt=""
        w={100}
        h={100}
        placeholder={<Box data-testid="ph" w="100%" h="100%" />}
        fallback={<Box data-testid="fb" w="100%" h="100%" />}
      />,
    );
    expect(container.querySelector('[data-testid="ph"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="fb"]')).toBeNull();
  });
});

describe('Image — onLoad / onError forwarding', () => {
  it('forwards onLoad in the wrapped case', () => {
    const onLoad = vi.fn();
    render(
      <Image
        src="/x.jpg"
        alt=""
        w={100}
        h={100}
        placeholder={<Box w="100%" h="100%" />}
        onLoad={onLoad}
      />,
    );
    const img = container.querySelector('img')!;
    act(() => {
      img.dispatchEvent(new Event('load'));
    });
    expect(onLoad).toHaveBeenCalledTimes(1);
  });

  it('forwards onError in the wrapped case', () => {
    const onError = vi.fn();
    render(
      <Image
        src="/x.jpg"
        alt=""
        w={100}
        h={100}
        fallback={<Box w="100%" h="100%" />}
        onError={onError}
      />,
    );
    const img = container.querySelector('img')!;
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('forwards onLoad in the simple case', () => {
    const onLoad = vi.fn();
    render(<Image src="/x.jpg" alt="" onLoad={onLoad} />);
    const img = container.querySelector('img')!;
    act(() => {
      img.dispatchEvent(new Event('load'));
    });
    expect(onLoad).toHaveBeenCalledTimes(1);
  });
});
