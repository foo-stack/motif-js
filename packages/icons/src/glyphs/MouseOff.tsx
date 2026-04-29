import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MouseOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 6v.343" /><Path d="M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218" /><Path d="M19 13.343V9A7 7 0 0 0 8.56 2.902" /><Path d="M22 22 2 2" /></>} />;
}
