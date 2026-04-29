import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function DiamondPercent(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z" /><Path d="M9.2 9.2h.01" /><Path d="m14.5 9.5-5 5" /><Path d="M14.7 14.8h.01" /></>} />;
}
