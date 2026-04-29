import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudLightning(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" /><Path d="m13 12-3 5h4l-3 5" /></>} />;
}
