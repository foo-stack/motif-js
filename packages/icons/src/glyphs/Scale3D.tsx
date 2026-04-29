import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Scale3D(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M5 7v11a1 1 0 0 0 1 1h11" /><Path d="M5.293 18.707 11 13" /><Circle cx="19" cy="19" r="2" /><Circle cx="5" cy="5" r="2" /></>} />;
}
