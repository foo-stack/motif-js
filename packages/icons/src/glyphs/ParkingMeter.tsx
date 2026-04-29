import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ParkingMeter(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M11 15h2" /><Path d="M12 12v3" /><Path d="M12 19v3" /><Path d="M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z" /><Path d="M9 9a3 3 0 1 1 6 0" /></>} />;
}
