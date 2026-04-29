import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Heading6(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M4 12h8" /><Path d="M4 18V6" /><Path d="M12 18V6" /><Circle cx="19" cy="16" r="2" /><Path d="M20 10c-2 2-3 3.5-3 6" /></>} />;
}
