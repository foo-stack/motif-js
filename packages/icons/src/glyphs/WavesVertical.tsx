import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WavesVertical(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 2q2 2.5 0 5t0 5 0 5 0 5" /><Path d="M19 2q2 2.5 0 5t0 5 0 5 0 5" /><Path d="M5 2q2 2.5 0 5t0 5 0 5 0 5" /></>} />;
}
