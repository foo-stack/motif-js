import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Gift(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M12 7v14" /><Path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" /><Path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" /><Rect x="3" y="7" width="18" height="4" rx="1" /></>} />;
}
