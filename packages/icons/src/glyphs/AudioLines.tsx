import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AudioLines(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M2 10v3" /><Path d="M6 6v11" /><Path d="M10 3v18" /><Path d="M14 8v7" /><Path d="M18 5v13" /><Path d="M22 10v3" /></>} />;
}
