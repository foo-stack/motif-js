import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ArrowUpNarrowWide(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m3 8 4-4 4 4" /><Path d="M7 4v16" /><Path d="M11 12h4" /><Path d="M11 16h7" /><Path d="M11 20h10" /></>} />;
}
