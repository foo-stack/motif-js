import { Children, cloneElement, isValidElement, type ReactNode, type SVGProps } from 'react';
import { Box, Pressable } from 'usemotif';

/**
 * Original chrome.css constrained child SVGs via descendant selectors
 * (`.bento__icon svg { width: 24 }`). Motif's inline `style` prop can't
 * target descendants, so we clone the child element(s) with explicit
 * width/height (and any extra svg attrs) attributes. Used wherever the
 * design's CSS sized SVGs uniformly across multiple icons.
 *
 * Only SVG elements (literal `<svg>` and function components — the
 * docs site's icon convention is a function returning `<svg>`) get
 * cloned. Non-svg elements (`<p>` MDX text wrappers, `<span>`, etc.)
 * pass through unchanged so we don't accidentally apply width/height
 * to layout elements.
 *
 * Non-element children (text, fragments) also pass through unchanged.
 */
export function sizeIconChildren(
  children: ReactNode,
  size: number,
  extra?: SVGProps<SVGSVGElement>,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (!isSvgElement(child)) return child;
    return cloneElement(child as React.ReactElement<SVGProps<SVGSVGElement>>, {
      width: size,
      height: size,
      ...extra,
    });
  });
}

function isSvgElement(child: React.ReactElement): boolean {
  // Literal `<svg>` element.
  if (child.type === 'svg') return true;
  // motif primitives are function components too, but they are layout
  // elements, not icons. Cloning width/height onto a `<Box as="span">`
  // wrapper collapses it — exclude them so they pass through unchanged.
  if (child.type === Box || child.type === Pressable) return false;
  // Function component — convention here is icon components returning <svg>.
  // (HTML primitives like 'p', 'span', 'div', 'a' are strings and excluded
  // by the explicit string check.)
  if (typeof child.type === 'function') return true;
  return false;
}
