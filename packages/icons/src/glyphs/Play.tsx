import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Play(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Polygon }) => <Polygon points="5 3 19 12 5 21 5 3" />} />;
}
