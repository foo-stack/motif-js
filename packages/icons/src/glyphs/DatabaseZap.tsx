import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function DatabaseZap(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Ellipse, Path }) => <><Ellipse cx="12" cy="5" rx="9" ry="3" /><Path d="M3 5V19A9 3 0 0 0 15 21.84" /><Path d="M21 5V8" /><Path d="M21 12L18 17H22L19 22" /><Path d="M3 12A9 3 0 0 0 14.59 14.87" /></>} />;
}
