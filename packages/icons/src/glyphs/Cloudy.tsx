import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Cloudy(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z" /><Path d="M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61" /></>} />;
}
