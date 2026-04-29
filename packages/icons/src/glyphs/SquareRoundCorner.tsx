import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SquareRoundCorner(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M21 11a8 8 0 0 0-8-8" /><Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /></>} />;
}
