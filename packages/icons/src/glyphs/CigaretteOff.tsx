import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CigaretteOff(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13" /><Path d="M18 8c0-2.5-2-2.5-2-5" /><Path d="m2 2 20 20" /><Path d="M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866" /><Path d="M22 8c0-2.5-2-2.5-2-5" /><Path d="M7 12v4" /></>} />;
}
