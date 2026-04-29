import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Minus(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M5 12h14" />} />;
}
