import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MarsStroke(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="m14 6 4 4" /><Path d="M17 3h4v4" /><Path d="m21 3-7.75 7.75" /><Circle cx="9" cy="15" r="6" /></>} />;
}
