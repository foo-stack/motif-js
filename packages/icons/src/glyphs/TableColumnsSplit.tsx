import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TableColumnsSplit(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M14 14v2" /><Path d="M14 20v2" /><Path d="M14 2v2" /><Path d="M14 8v2" /><Path d="M2 15h8" /><Path d="M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2" /><Path d="M2 9h8" /><Path d="M22 15h-4" /><Path d="M22 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" /><Path d="M22 9h-4" /><Path d="M5 3v18" /></>} />;
}
