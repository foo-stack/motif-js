import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FileQuestionMark(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" /><Path d="M12 17h.01" /><Path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" /></>} />;
}
