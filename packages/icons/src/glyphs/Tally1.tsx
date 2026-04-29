import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Tally1(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M4 4v16" />} />;
}
