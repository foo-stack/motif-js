import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RockingChair(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m15 13 3.708 7.416" /><Path d="M3 19a15 15 0 0 0 18 0" /><Path d="m3 2 3.21 9.633A2 2 0 0 0 8.109 13H18" /><Path d="m9 13-3.708 7.416" /></>} />;
}
