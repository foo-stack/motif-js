import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CornerRightDown(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m10 15 5 5 5-5" /><Path d="M4 4h7a4 4 0 0 1 4 4v12" /></>} />;
}
