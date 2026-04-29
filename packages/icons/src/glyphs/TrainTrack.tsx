import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TrainTrack(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M2 17 17 2" /><Path d="m2 14 8 8" /><Path d="m5 11 8 8" /><Path d="m8 8 8 8" /><Path d="m11 5 8 8" /><Path d="m14 2 8 8" /><Path d="M7 22 22 7" /></>} />;
}
