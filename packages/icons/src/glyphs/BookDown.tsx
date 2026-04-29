import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BookDown(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 13V7" /><Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><Path d="m9 10 3 3 3-3" /></>} />;
}
