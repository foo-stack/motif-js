import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronsDownUp(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m7 20 5-5 5 5" /><Path d="m7 4 5 5 5-5" /></>} />;
}
