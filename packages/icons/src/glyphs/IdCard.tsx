import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function IdCard(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Path d="M16 10h2" /><Path d="M16 14h2" /><Path d="M6.17 15a3 3 0 0 1 5.66 0" /><Circle cx="9" cy="11" r="2" /><Rect x="2" y="5" width="20" height="14" rx="2" /></>} />;
}
