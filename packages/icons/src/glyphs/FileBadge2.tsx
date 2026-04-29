import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileBadge2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.3" /><Path d="M14 2v5a1 1 0 0 0 1 1h5" /><Path d="m7.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.879.001l-1.846.85a.5.5 0 0 1-.692-.593l1.29-4.88" /><Circle cx="6" cy="14" r="3" /></>} />;
}
