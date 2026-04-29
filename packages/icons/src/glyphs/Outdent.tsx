import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Outdent(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M21 5H11" /><Path d="M21 12H11" /><Path d="M21 19H11" /><Path d="m7 8-4 4 4 4" /></>} />;
}
