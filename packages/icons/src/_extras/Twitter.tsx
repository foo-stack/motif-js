import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

/**
 * Twitter mark — backward-compat icon. Lucide's brand pack moved out
 * of `lucide-react` after motif's v1, but the old "bird" Twitter mark
 * is still the most-recognised social affordance for legacy
 * integrations. Apps targeting the post-rebrand "X" should pull in a
 * dedicated brand pack instead.
 *
 * Path data: original lucide v0.x Twitter mark, MIT-licensed.
 */
export function Twitter(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <Path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      )}
    />
  );
}
