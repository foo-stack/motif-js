import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SlidersHorizontal(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 5H3" /><Path d="M12 19H3" /><Path d="M14 3v4" /><Path d="M16 17v4" /><Path d="M21 12h-9" /><Path d="M21 19h-5" /><Path d="M21 5h-7" /><Path d="M8 10v4" /><Path d="M8 12H3" /></>} />;
}
