import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

/**
 * Discord mark — backward-compat icon. Discord was never in
 * lucide's main pack but is one of the most-requested chat-app
 * brand marks; carried here for parity with Slack / Twitter / etc.
 *
 * Path data: simplified single-stroke version of the Discord
 * "speech bubble with eyes" mark. Public-domain hand-rolled glyph.
 */
export function Discord(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Circle }) => (
        <>
          <Path d="M5 6c2-1 4-1.5 7-1.5s5 .5 7 1.5l1 12-3-2-2 1H7l-2-1-3 2z" />
          <Circle cx="9" cy="12" r="1.5" />
          <Circle cx="15" cy="12" r="1.5" />
        </>
      )}
    />
  );
}
