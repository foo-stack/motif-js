import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GitPullRequestArrow(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="5" cy="6" r="3" /><Path d="M5 9v12" /><Circle cx="19" cy="18" r="3" /><Path d="m15 9-3-3 3-3" /><Path d="M12 6h5a2 2 0 0 1 2 2v7" /></>} />;
}
