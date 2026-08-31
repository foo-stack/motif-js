import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

/**
 * YouTube mark - backward-compat icon. Lucide's brand pack moved
 * out of `lucide-react` after motif's v1; the path data here is the
 * canonical lucide v0.x Youtube glyph (rounded rectangle + play
 * triangle).
 *
 * Path data: original lucide v0.x Youtube mark, MIT-licensed.
 */
export function Youtube(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <Path d="m10 15 5-3-5-3z" />
        </>
      )}
    />
  );
}
