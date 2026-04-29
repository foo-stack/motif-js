import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UserRoundKey(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M19 11v6" /><Path d="M19 13h2" /><Path d="M2 21a8 8 0 0 1 12.868-6.349" /><Circle cx="10" cy="8" r="5" /><Circle cx="19" cy="19" r="2" /></>} />;
}
