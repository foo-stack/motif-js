import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronRight(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Polyline }) => <Polyline points="9 18 15 12 9 6" />} />;
}
