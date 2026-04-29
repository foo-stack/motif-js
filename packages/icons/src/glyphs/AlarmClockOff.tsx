import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlarmClockOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M6.87 6.87a8 8 0 1 0 11.26 11.26" /><Path d="M19.9 14.25a8 8 0 0 0-9.15-9.15" /><Path d="m22 6-3-3" /><Path d="M6.26 18.67 4 21" /><Path d="m2 2 20 20" /><Path d="M4 4 2 6" /></>} />;
}
