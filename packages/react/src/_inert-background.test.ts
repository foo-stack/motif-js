import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isolateBackground } from './_inert-background.js';

describe('isolateBackground', () => {
  let background: HTMLDivElement;
  let overlayRoot: HTMLDivElement;
  let overlayInner: HTMLDivElement;

  beforeEach(() => {
    background = document.createElement('div');
    background.id = 'background';

    overlayRoot = document.createElement('div');
    overlayInner = document.createElement('div');
    overlayRoot.append(overlayInner);

    document.body.append(background, overlayRoot);
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it('marks background siblings inert and aria-hidden', () => {
    const release = isolateBackground(overlayInner);

    expect(background.getAttribute('inert')).toBe('');
    expect(background.getAttribute('aria-hidden')).toBe('true');

    release();
  });

  it('leaves the overlay subtree alone', () => {
    const release = isolateBackground(overlayInner);

    expect(overlayRoot.hasAttribute('inert')).toBe(false);
    expect(overlayRoot.hasAttribute('aria-hidden')).toBe(false);
    expect(overlayInner.hasAttribute('inert')).toBe(false);

    release();
  });

  it('resolves the boundary through a themed portal wrapper', () => {
    // Portal inserts <div data-theme> above the overlay when a theme is in
    // scope, so the overlay sits two levels below body rather than one.
    const themed = document.createElement('div');
    themed.setAttribute('data-theme', 'dark');
    const deepOverlay = document.createElement('div');
    themed.append(deepOverlay);
    document.body.append(themed);

    const release = isolateBackground(deepOverlay);

    expect(themed.hasAttribute('inert')).toBe(false);
    expect(background.getAttribute('inert')).toBe('');
    expect(overlayRoot.getAttribute('inert')).toBe('');

    release();
  });

  it('never hides a live region, so toasts keep announcing', () => {
    const toasts = document.createElement('div');
    toasts.setAttribute('aria-live', 'polite');
    document.body.append(toasts);

    const release = isolateBackground(overlayInner);

    expect(toasts.hasAttribute('inert')).toBe(false);
    expect(toasts.hasAttribute('aria-hidden')).toBe(false);

    release();
  });

  it('never hides a wrapper containing a live region', () => {
    const wrapper = document.createElement('div');
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'assertive');
    wrapper.append(region);
    document.body.append(wrapper);

    const release = isolateBackground(overlayInner);

    expect(wrapper.hasAttribute('aria-hidden')).toBe(false);

    release();
  });

  it('skips non-rendered nodes', () => {
    const script = document.createElement('script');
    document.body.append(script);

    const release = isolateBackground(overlayInner);

    expect(script.hasAttribute('inert')).toBe(false);

    release();
  });

  it('restores a pre-existing aria-hidden rather than removing it', () => {
    background.setAttribute('aria-hidden', 'true');

    const release = isolateBackground(overlayInner);
    release();

    expect(background.getAttribute('aria-hidden')).toBe('true');
  });

  it('restores a pre-existing inert rather than removing it', () => {
    background.setAttribute('inert', '');

    const release = isolateBackground(overlayInner);
    release();

    expect(background.hasAttribute('inert')).toBe(true);
  });

  it('restores the DOM exactly when nothing was set before', () => {
    const release = isolateBackground(overlayInner);
    release();

    expect(background.hasAttribute('inert')).toBe(false);
    expect(background.hasAttribute('aria-hidden')).toBe(false);
    expect(background.outerHTML).toBe('<div id="background"></div>');
  });

  it('keeps the outer isolation intact when a nested overlay releases', () => {
    const secondOverlay = document.createElement('div');
    document.body.append(secondOverlay);

    const releaseOuter = isolateBackground(overlayInner);
    const releaseInner = isolateBackground(secondOverlay);

    // Both overlays marked the shared background node.
    releaseInner();
    expect(background.getAttribute('inert')).toBe('');

    releaseOuter();
    expect(background.hasAttribute('inert')).toBe(false);
  });

  it('marks the outer overlay as background for a nested overlay', () => {
    const secondOverlay = document.createElement('div');
    document.body.append(secondOverlay);

    const releaseOuter = isolateBackground(overlayInner);
    const releaseInner = isolateBackground(secondOverlay);

    expect(overlayRoot.getAttribute('inert')).toBe('');

    releaseInner();
    expect(overlayRoot.hasAttribute('inert')).toBe(false);

    releaseOuter();
  });

  it('ignores a release called twice', () => {
    const secondOverlay = document.createElement('div');
    document.body.append(secondOverlay);

    const releaseOuter = isolateBackground(overlayInner);
    const releaseInner = isolateBackground(secondOverlay);

    releaseInner();
    releaseInner();
    expect(background.getAttribute('inert')).toBe('');

    releaseOuter();
    expect(background.hasAttribute('inert')).toBe(false);
  });

  it('is a no-op for a detached node', () => {
    const orphan = document.createElement('div');
    const release = isolateBackground(orphan);

    expect(background.hasAttribute('inert')).toBe(false);
    release();
  });
});
