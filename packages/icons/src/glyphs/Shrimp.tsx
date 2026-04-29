import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Shrimp(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M11 12h.01" /><Path d="M13 22c.5-.5 1.12-1 2.5-1-1.38 0-2-.5-2.5-1" /><Path d="M14 2a3.28 3.28 0 0 1-3.227 1.798l-6.17-.561A2.387 2.387 0 1 0 4.387 8H15.5a1 1 0 0 1 0 13 1 1 0 0 0 0-5H12a7 7 0 0 1-7-7V8" /><Path d="M14 8a8.5 8.5 0 0 1 0 8" /><Path d="M16 16c2 0 4.5-4 4-6" /></>} />;
}
