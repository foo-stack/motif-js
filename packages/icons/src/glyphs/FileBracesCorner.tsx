import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileBracesCorner(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M14 22h4a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v6" /><Path d="M14 2v5a1 1 0 0 0 1 1h5" /><Path d="M5 14a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1 1 1 0 0 1 1 1v2a1 1 0 0 0 1 1" /><Path d="M9 22a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1" /></>} />;
}
