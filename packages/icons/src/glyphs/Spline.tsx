import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Spline(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="19" cy="5" r="2" /><Circle cx="5" cy="19" r="2" /><Path d="M5 17A12 12 0 0 1 17 5" /></>} />;
}
