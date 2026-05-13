import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

/**
 * LinkedIn mark — backward-compat icon. Lucide's brand pack moved
 * out of `lucide-react` after motif's v1; the path data here is the
 * canonical lucide v0.x LinkedIn glyph (rectangle + small "in"
 * pictogram).
 *
 * Path data: original lucide v0.x Linkedin mark, MIT-licensed.
 */
export function Linkedin(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect, Circle }) => (
        <>
          <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <Rect width="4" height="12" x="2" y="9" />
          <Circle cx="4" cy="4" r="2" />
        </>
      )}
    />
  );
}
