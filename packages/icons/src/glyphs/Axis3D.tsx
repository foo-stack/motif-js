import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Axis3D(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M13.5 10.5 15 9" /><Path d="M4 4v15a1 1 0 0 0 1 1h15" /><Path d="M4.293 19.707 6 18" /><Path d="m9 15 1.5-1.5" /></>} />;
}
