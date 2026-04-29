import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GlobeLock(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13" /><Path d="M2 12h8.5" /><Path d="M20 6V4a2 2 0 1 0-4 0v2" /><Rect width="8" height="5" x="14" y="6" rx="1" /></>} />;
}
