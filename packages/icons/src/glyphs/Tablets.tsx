import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Tablets(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="7" cy="7" r="5" /><Circle cx="17" cy="17" r="5" /><Path d="M12 17h10" /><Path d="m3.46 10.54 7.08-7.08" /></>} />;
}
