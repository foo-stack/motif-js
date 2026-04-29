import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RefreshCwOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47" /><Path d="M8 16H3v5" /><Path d="M3 12C3 9.51 4 7.26 5.64 5.64" /><Path d="m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64" /><Path d="M21 12c0 1-.16 1.97-.47 2.87" /><Path d="M21 3v5h-5" /><Path d="M22 22 2 2" /></>} />;
}
