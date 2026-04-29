import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Dot(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle }) => <Circle cx="12.1" cy="12.1" r="1" />} />;
}
