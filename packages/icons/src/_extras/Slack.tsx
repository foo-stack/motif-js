import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

/**
 * Slack mark - backward-compat icon. Lucide's brand pack moved out
 * of `lucide-react` after motif's v1; the path data here is the
 * canonical lucide v0.x Slack glyph (the four-rectangle hash).
 *
 * Path data: original lucide v0.x Slack mark, MIT-licensed.
 */
export function Slack(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Rect, Path }) => (
        <>
          <Rect width="3" height="8" x="13" y="2" rx="1.5" />
          <Path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
          <Rect width="3" height="8" x="8" y="14" rx="1.5" />
          <Path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
          <Rect width="8" height="3" x="14" y="13" rx="1.5" />
          <Path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
          <Rect width="8" height="3" x="2" y="8" rx="1.5" />
          <Path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
        </>
      )}
    />
  );
}
