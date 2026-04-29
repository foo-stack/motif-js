import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BatteryPlus(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 9v6" /><Path d="M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605" /><Path d="M22 14v-4" /><Path d="M7 12h6" /><Path d="M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606" /></>} />;
}
