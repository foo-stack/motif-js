import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MoveDown(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M8 18L12 22L16 18" /><Path d="M12 2V22" /></>} />;
}
