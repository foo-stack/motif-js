import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronsRightLeft(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m20 17-5-5 5-5" /><Path d="m4 17 5-5-5-5" /></>} />;
}
