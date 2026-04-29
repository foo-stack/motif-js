import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CircleArrowOutUpRight(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M22 12A10 10 0 1 1 12 2" /><Path d="M22 2 12 12" /><Path d="M16 2h6v6" /></>} />;
}
