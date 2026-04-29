import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RotateCw(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><Path d="M21 3v5h-5" /></>} />;
}
