import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cylinder(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Ellipse, Path }) => <><Ellipse cx="12" cy="5" rx="9" ry="3" /><Path d="M3 5v14a9 3 0 0 0 18 0V5" /></>} />;
}
