import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Syringe(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m18 2 4 4" /><Path d="m17 7 3-3" /><Path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" /><Path d="m9 11 4 4" /><Path d="m5 19-3 3" /><Path d="m14 4 6 6" /></>} />;
}
