import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MoveHorizontal(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m18 8 4 4-4 4" /><Path d="M2 12h20" /><Path d="m6 8-4 4 4 4" /></>} />;
}
