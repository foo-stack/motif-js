import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Hash(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line }) => <><Line x1="4" x2="20" y1="9" y2="9" /><Line x1="4" x2="20" y1="15" y2="15" /><Line x1="10" x2="8" y1="3" y2="21" /><Line x1="16" x2="14" y1="3" y2="21" /></>} />;
}
