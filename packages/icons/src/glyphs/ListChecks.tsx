import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListChecks(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M13 5h8" /><Path d="M13 12h8" /><Path d="M13 19h8" /><Path d="m3 17 2 2 4-4" /><Path d="m3 7 2 2 4-4" /></>} />;
}
