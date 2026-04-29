import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PackageMinus(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 22V12" /><Path d="M16 17h6" /><Path d="M21 13V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.675-.955" /><Path d="M3.29 7 12 12l8.71-5" /><Path d="m7.5 4.27 8.997 5.148" /></>} />;
}
