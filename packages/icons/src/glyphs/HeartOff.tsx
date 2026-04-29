import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HeartOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655" /><Path d="m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761" /><Path d="m2 2 20 20" /></>} />;
}
