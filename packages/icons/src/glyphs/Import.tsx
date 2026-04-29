import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Import(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 3v12" /><Path d="m8 11 4 4 4-4" /><Path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" /></>} />;
}
