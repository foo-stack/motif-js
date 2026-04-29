import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Check(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M20 6 9 17l-5-5" />} />;
}
