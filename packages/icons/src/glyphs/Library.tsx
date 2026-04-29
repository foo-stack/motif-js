import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Library(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m16 6 4 14" /><Path d="M12 6v14" /><Path d="M8 8v12" /><Path d="M4 4v16" /></>} />;
}
