import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Navigation(props: IconProps): ReactElement {
  return (
    <Icon {...props} render={({ Polygon }) => <Polygon points="3 11 22 2 13 21 11 13 3 11" />} />
  );
}
