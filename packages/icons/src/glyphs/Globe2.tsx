import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Globe2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" /><Path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" /><Path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" /><Circle cx="12" cy="12" r="10" /></>} />;
}
