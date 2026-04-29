import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function StickyNote(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" /><Path d="M15 3v5a1 1 0 0 0 1 1h5" /></>} />;
}
