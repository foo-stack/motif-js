import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronsLeftRight(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m9 7-5 5 5 5" /><Path d="m15 7 5 5-5 5" /></>} />;
}
