import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SplinePointer(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" /><Path d="M5 17A12 12 0 0 1 17 5" /><Circle cx="19" cy="5" r="2" /><Circle cx="5" cy="19" r="2" /></>} />;
}
