import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlignLeft(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M21 5H3" /><Path d="M15 12H3" /><Path d="M17 19H3" /></>} />;
}
