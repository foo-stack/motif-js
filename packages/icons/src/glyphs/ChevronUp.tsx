import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronUp(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Polyline }) => <Polyline points="18 15 12 9 6 15" />} />;
}
