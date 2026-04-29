import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Locate(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Line }) => <><Line x1="2" x2="5" y1="12" y2="12" /><Line x1="19" x2="22" y1="12" y2="12" /><Line x1="12" x2="12" y1="2" y2="5" /><Line x1="12" x2="12" y1="19" y2="22" /><Circle cx="12" cy="12" r="7" /></>} />;
}
