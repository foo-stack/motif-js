import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Check(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Polyline }) => <Polyline points="20 6 9 17 4 12" />} />;
}
