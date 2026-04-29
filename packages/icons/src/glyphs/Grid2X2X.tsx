import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Grid2X2X(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3" /><Path d="m16 16 5 5" /><Path d="m16 21 5-5" /></>} />;
}
