import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Route(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="6" cy="19" r="3" /><Path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><Circle cx="18" cy="5" r="3" /></>} />;
}
