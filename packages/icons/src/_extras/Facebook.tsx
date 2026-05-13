import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

/**
 * Facebook mark — backward-compat icon. Lucide's brand pack moved
 * out of `lucide-react` after motif's v1; the path data here is the
 * canonical lucide v0.x Facebook glyph.
 *
 * Path data: original lucide v0.x Facebook mark, MIT-licensed.
 */
export function Facebook(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      )}
    />
  );
}
