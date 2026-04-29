import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Balloon(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 16v1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v1" /><Path d="M12 6a2 2 0 0 1 2 2" /><Path d="M18 8c0 4-3.5 8-6 8s-6-4-6-8a6 6 0 0 1 12 0" /></>} />;
}
