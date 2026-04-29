import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WavesArrowUp(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 2v8" /><Path d="M2 15c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><Path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><Path d="m8 6 4-4 4 4" /></>} />;
}
