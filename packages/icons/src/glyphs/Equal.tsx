import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Equal(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Line }) => <><Line x1="5" x2="19" y1="9" y2="9" /><Line x1="5" x2="19" y1="15" y2="15" /></>} />;
}
