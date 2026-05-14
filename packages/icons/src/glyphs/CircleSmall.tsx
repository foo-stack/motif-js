import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function CircleSmall(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle }) => <Circle cx="12" cy="12" r="6" />} />;
}
