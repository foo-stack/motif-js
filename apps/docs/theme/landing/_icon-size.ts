import { Children, cloneElement, isValidElement, type ReactNode, type SVGProps } from 'react';

/**
 * Original chrome.css constrained child SVGs via descendant selectors
 * (`.bento__icon svg { width: 24 }`). Motif's inline `style` prop can't
 * target descendants, so we clone the child element(s) with explicit
 * width/height (and any extra svg attrs) attributes. Used wherever the
 * design's CSS sized SVGs uniformly across multiple icons.
 *
 * Non-element children (text, fragments) pass through unchanged.
 */
export function sizeIconChildren(
  children: ReactNode,
  size: number,
  extra?: SVGProps<SVGSVGElement>,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    return cloneElement(child as React.ReactElement<SVGProps<SVGSVGElement>>, {
      width: size,
      height: size,
      ...extra,
    });
  });
}
