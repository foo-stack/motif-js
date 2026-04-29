import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Amphora(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8" /><Path d="M10 5H8a2 2 0 0 0 0 4h.68" /><Path d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" /><Path d="M14 5h2a2 2 0 0 1 0 4h-.68" /><Path d="M18 22H6" /><Path d="M9 2h6" /></>} />;
}
