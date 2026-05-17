import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function Circle(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle }) => <Circle cx="12" cy="12" r="10" />} />;
}
