import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Angry(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="12" cy="12" r="10" /><Path d="M16 16s-1.5-2-4-2-4 2-4 2" /><Path d="M7.5 8 10 9" /><Path d="m14 9 2.5-1" /><Path d="M9 10h.01" /><Path d="M15 10h.01" /></>} />;
}
