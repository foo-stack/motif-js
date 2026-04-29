import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WifiZero(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M12 20h.01" />} />;
}
