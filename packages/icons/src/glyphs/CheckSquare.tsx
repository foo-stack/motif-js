import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CheckSquare(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" /><Path d="m9 11 3 3L22 4" /></>} />;
}
