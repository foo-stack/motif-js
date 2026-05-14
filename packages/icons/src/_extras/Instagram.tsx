import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

/**
 * Instagram mark — backward-compat icon. Lucide's brand pack moved
 * out of `lucide-react` after motif's v1; the path data here is the
 * canonical lucide v0.x Instagram glyph.
 *
 * Path data: original lucide v0.x Instagram mark, MIT-licensed.
 */
export function Instagram(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Line, Rect, Path }) => (
        <>
          <Rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <Line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </>
      )}
    />
  );
}
