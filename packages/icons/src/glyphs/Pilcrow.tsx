import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Pilcrow(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M13 4v16" /><Path d="M17 4v16" /><Path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13" /></>} />;
}
