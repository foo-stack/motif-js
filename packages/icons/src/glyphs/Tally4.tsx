import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Tally4(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M4 4v16" /><Path d="M9 4v16" /><Path d="M14 4v16" /><Path d="M19 4v16" /></>} />;
}
