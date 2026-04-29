import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GitFork(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="12" cy="18" r="3" /><Circle cx="6" cy="6" r="3" /><Circle cx="18" cy="6" r="3" /><Path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" /><Path d="M12 12v3" /></>} />;
}
