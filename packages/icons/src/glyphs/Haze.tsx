import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Haze(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m5.2 6.2 1.4 1.4" /><Path d="M2 13h2" /><Path d="M20 13h2" /><Path d="m17.4 7.6 1.4-1.4" /><Path d="M22 17H2" /><Path d="M22 21H2" /><Path d="M16 13a4 4 0 0 0-8 0" /><Path d="M12 5V2.5" /></>} />;
}
