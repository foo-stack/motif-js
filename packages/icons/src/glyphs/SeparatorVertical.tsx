import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SeparatorVertical(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 3v18" /><Path d="m16 16 4-4-4-4" /><Path d="m8 8-4 4 4 4" /></>} />;
}
