import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Grip(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle }) => <><Circle cx="12" cy="5" r="1" /><Circle cx="19" cy="5" r="1" /><Circle cx="5" cy="5" r="1" /><Circle cx="12" cy="12" r="1" /><Circle cx="19" cy="12" r="1" /><Circle cx="5" cy="12" r="1" /><Circle cx="12" cy="19" r="1" /><Circle cx="19" cy="19" r="1" /><Circle cx="5" cy="19" r="1" /></>} />;
}
