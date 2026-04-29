import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ClockPlus(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 6v6l3.644 1.822" /><Path d="M16 19h6" /><Path d="M19 16v6" /><Path d="M21.92 13.267a10 10 0 1 0-8.653 8.653" /></>} />;
}
