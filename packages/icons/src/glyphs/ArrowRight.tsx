import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowRight(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M5 12h14" /><Path d="m12 5 7 7-7 7" /></>} />;
}
