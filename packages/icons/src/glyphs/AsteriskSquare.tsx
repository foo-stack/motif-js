import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AsteriskSquare(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Path d="M12 8v8" /><Path d="m8.5 14 7-4" /><Path d="m8.5 10 7 4" /></>} />;
}
