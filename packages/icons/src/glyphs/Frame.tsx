import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Frame(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line }) => <><Line x1="22" x2="2" y1="6" y2="6" /><Line x1="22" x2="2" y1="18" y2="18" /><Line x1="6" x2="6" y1="2" y2="22" /><Line x1="18" x2="18" y1="2" y2="22" /></>} />;
}
