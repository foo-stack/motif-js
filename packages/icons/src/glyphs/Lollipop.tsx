import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Lollipop(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="11" cy="11" r="8" /><Path d="m21 21-4.3-4.3" /><Path d="M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0" /></>} />;
}
