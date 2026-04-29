import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Warehouse(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11" /><Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z" /><Path d="M6 13h12" /><Path d="M6 17h12" /></>} />;
}
