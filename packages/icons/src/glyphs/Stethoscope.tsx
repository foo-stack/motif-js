import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Stethoscope(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M11 2v2" /><Path d="M5 2v2" /><Path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" /><Path d="M8 15a6 6 0 0 0 12 0v-3" /><Circle cx="20" cy="10" r="2" /></>} />;
}
