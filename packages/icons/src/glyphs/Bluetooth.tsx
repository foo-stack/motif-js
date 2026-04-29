import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Bluetooth(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="m7 7 10 10-5 5V2l5 5L7 17" />} />;
}
