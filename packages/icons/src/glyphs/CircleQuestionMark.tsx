import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CircleQuestionMark(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="12" cy="12" r="10" /><Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><Path d="M12 17h.01" /></>} />;
}
