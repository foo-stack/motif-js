import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function BookText(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><Path d="M8 11h8" /><Path d="M8 7h6" /></>} />;
}
