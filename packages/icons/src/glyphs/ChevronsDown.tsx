import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ChevronsDown(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m7 6 5 5 5-5" /><Path d="m7 13 5 5 5-5" /></>} />;
}
