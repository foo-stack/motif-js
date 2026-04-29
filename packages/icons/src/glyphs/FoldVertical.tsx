import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FoldVertical(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 22v-6" /><Path d="M12 8V2" /><Path d="M4 12H2" /><Path d="M10 12H8" /><Path d="M16 12h-2" /><Path d="M22 12h-2" /><Path d="m15 19-3-3-3 3" /><Path d="m15 5-3 3-3-3" /></>} />;
}
