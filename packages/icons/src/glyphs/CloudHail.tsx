import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudHail(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><Path d="M16 14v2" /><Path d="M8 14v2" /><Path d="M16 20h.01" /><Path d="M8 20h.01" /><Path d="M12 16v2" /><Path d="M12 22h.01" /></>} />;
}
