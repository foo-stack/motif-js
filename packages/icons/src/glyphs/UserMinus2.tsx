import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UserMinus2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M2 21a8 8 0 0 1 13.292-6" /><Circle cx="10" cy="8" r="5" /><Path d="M22 19h-6" /></>} />;
}
