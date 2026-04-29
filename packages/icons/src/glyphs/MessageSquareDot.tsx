import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MessageSquareDot(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7" /><Circle cx="19" cy="6" r="3" /></>} />;
}
