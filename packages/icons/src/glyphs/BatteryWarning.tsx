import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BatteryWarning(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 17h.01" /><Path d="M10 7v6" /><Path d="M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" /><Path d="M22 14v-4" /><Path d="M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" /></>} />;
}
