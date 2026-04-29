import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function IterationCcw(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m16 14 4 4-4 4" /><Path d="M20 10a8 8 0 1 0-8 8h8" /></>} />;
}
