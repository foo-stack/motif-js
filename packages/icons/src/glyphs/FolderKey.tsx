import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderKey(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M13 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.36" /><Path d="M19 12v6" /><Path d="M19 14h2" /><Circle cx="19" cy="20" r="2" /></>} />;
}
