import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Move3D(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M5 3v16h16" /><Path d="m5 19 6-6" /><Path d="m2 6 3-3 3 3" /><Path d="m18 16 3 3-3 3" /></>} />;
}
