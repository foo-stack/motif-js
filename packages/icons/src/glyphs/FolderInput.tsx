import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderInput(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1" /><Path d="M2 13h10" /><Path d="m9 16 3-3-3-3" /></>} />;
}
