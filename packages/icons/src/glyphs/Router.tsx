import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Router(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="20" height="8" x="2" y="14" rx="2" /><Path d="M6.01 18H6" /><Path d="M10.01 18H10" /><Path d="M15 10v4" /><Path d="M17.84 7.17a4 4 0 0 0-5.66 0" /><Path d="M20.66 4.34a8 8 0 0 0-11.31 0" /></>} />;
}
