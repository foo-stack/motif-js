import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GitPullRequest(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Line, Path }) => <><Circle cx="18" cy="18" r="3" /><Circle cx="6" cy="6" r="3" /><Path d="M13 6h3a2 2 0 0 1 2 2v7" /><Line x1="6" x2="6" y1="9" y2="21" /></>} />;
}
