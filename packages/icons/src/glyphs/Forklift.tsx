import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Forklift(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M12 12H5a2 2 0 0 0-2 2v5" /><Path d="M15 19h7" /><Path d="M16 19V2" /><Path d="M6 12V7a2 2 0 0 1 2-2h2.172a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 16 10.828" /><Path d="M7 19h4" /><Circle cx="13" cy="19" r="2" /><Circle cx="5" cy="19" r="2" /></>} />;
}
