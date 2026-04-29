import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MapPinOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12.75 7.09a3 3 0 0 1 2.16 2.16" /><Path d="M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568" /><Path d="m2 2 20 20" /><Path d="M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533" /><Path d="M9.13 9.13a3 3 0 0 0 3.74 3.74" /></>} />;
}
