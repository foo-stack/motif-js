import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CheckLine(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M20 4L9 15" /><Path d="M21 19L3 19" /><Path d="M9 15L4 10" /></>} />;
}
