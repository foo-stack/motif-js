import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Church(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 9h4" /><Path d="M12 7v5" /><Path d="M14 21v-3a2 2 0 0 0-4 0v3" /><Path d="m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9" /><Path d="M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14" /></>} />;
}
