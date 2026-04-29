import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TurkishLira(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M15 4 5 9" /><Path d="m15 8.5-10 5" /><Path d="M18 12a9 9 0 0 1-9 9V3" /></>} />;
}
