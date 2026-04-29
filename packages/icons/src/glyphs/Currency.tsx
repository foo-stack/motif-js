import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Currency(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Line }) => <><Circle cx="12" cy="12" r="8" /><Line x1="3" x2="6" y1="3" y2="6" /><Line x1="21" x2="18" y1="3" y2="6" /><Line x1="3" x2="6" y1="21" y2="18" /><Line x1="21" x2="18" y1="21" y2="18" /></>} />;
}
