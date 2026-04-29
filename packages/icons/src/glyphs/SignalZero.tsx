import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SignalZero(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M2 20h.01" />} />;
}
