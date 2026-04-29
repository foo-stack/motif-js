import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Move(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 2v20" /><Path d="m15 19-3 3-3-3" /><Path d="m19 9 3 3-3 3" /><Path d="M2 12h20" /><Path d="m5 9-3 3 3 3" /><Path d="m9 5 3-3 3 3" /></>} />;
}
