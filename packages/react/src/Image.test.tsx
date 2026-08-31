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

describe('Image - simple case (no placeholder/fallback)', () => {
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

describe('Image - wrapped case (placeholder)', () => {
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

  // #155 - img-presentation props must land on the inner <img>, not the
  // wrapper (where objectFit is inert). This is the docstring's own
  // objectFit + placeholder combination.
  it('forwards objectFit/objectPosition to the inner img, not the wrapper', () => {
    render(
      <Image
        src="/x.jpg"
        alt=""
        w={100}
        h={100}
        objectFit="cover"
        objectPosition="top"
        placeholder={<Box bg="#eee" w="100%" h="100%" />}
      />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const img = container.querySelector('img')!;
    expect(img.style.objectFit).toBe('cover');
    expect(img.style.objectPosition).toBe('top');
    // The wrapper must NOT carry them (where they'd be inert).
    expect(wrapper.style.objectFit).toBe('');
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

describe('Image - wrapped case (fallback distinct from placeholder)', () => {
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

describe('Image - onLoad / onError forwarding', () => {
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

describe('Image - status reset + cached recovery', () => {
  const ph = <Box data-testid="ph" w="100%" h="100%" />;

  // Regression: status never reset on src change, so a loaded image kept
  // opacity 1 (no placeholder) when pointed at a new, still-loading src.
  it('resets to the loading state when src changes', () => {
    render(<Image src="/a.jpg" alt="" w={100} h={100} placeholder={ph} />);
    const img = container.querySelector('img')!;
    // jsdom never really loads - pin complete=false so the reset path runs.
    Object.defineProperty(img, 'complete', { configurable: true, value: false });
    act(() => img.dispatchEvent(new Event('load')));
    expect(img.style.opacity).toBe('1');
    expect(container.querySelector('[data-testid="ph"]')).toBeNull();

    // Point at a new src - must drop back to loading (placeholder, opacity 0).
    render(<Image src="/b.jpg" alt="" w={100} h={100} placeholder={ph} />);
    expect(container.querySelector('img')!.style.opacity).toBe('0');
    expect(container.querySelector('[data-testid="ph"]')).not.toBeNull();
  });

  // Regression: a cached image can finish before React attaches onLoad, so
  // `img.complete` is already true and the handler never fires. The mount
  // effect must recover that and reveal the image.
  it('recovers an already-complete (cached) image without a load event', () => {
    const proto = window.HTMLImageElement.prototype;
    const completeDesc = Object.getOwnPropertyDescriptor(proto, 'complete');
    const naturalWidthDesc = Object.getOwnPropertyDescriptor(proto, 'naturalWidth');
    Object.defineProperty(proto, 'complete', { configurable: true, get: () => true });
    Object.defineProperty(proto, 'naturalWidth', { configurable: true, get: () => 1 });
    try {
      render(<Image src="/cached.jpg" alt="" w={100} h={100} placeholder={ph} />);
      // No load event dispatched - recovery comes from the complete check.
      expect(container.querySelector('img')!.style.opacity).toBe('1');
      expect(container.querySelector('[data-testid="ph"]')).toBeNull();
    } finally {
      if (completeDesc) Object.defineProperty(proto, 'complete', completeDesc);
      if (naturalWidthDesc) Object.defineProperty(proto, 'naturalWidth', naturalWidthDesc);
    }
  });
});
