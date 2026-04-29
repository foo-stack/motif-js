import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GitBranch(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M15 6a9 9 0 0 0-9 9V3" /><Circle cx="18" cy="6" r="3" /><Circle cx="6" cy="18" r="3" /></>} />;
}
