import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Film(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Path d="M7 3v18" /><Path d="M3 7.5h4" /><Path d="M3 12h18" /><Path d="M3 16.5h4" /><Path d="M17 3v18" /><Path d="M17 7.5h4" /><Path d="M17 16.5h4" /></>} />;
}
