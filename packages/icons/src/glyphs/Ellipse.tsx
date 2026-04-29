import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Ellipse(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Ellipse }) => <Ellipse cx="12" cy="12" rx="10" ry="6" />} />;
}
