import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronDown(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Polyline }) => <Polyline points="6 9 12 15 18 9" />} />;
}
