import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Navigation2(props: IconProps): ReactElement {
  return (
    <Icon {...props} render={({ Polygon }) => <Polygon points="12 2 19 21 12 17 5 21 12 2" />} />
  );
}
