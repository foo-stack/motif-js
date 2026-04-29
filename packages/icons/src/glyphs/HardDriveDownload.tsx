import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HardDriveDownload(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M12 2v8" /><Path d="m16 6-4 4-4-4" /><Rect width="20" height="8" x="2" y="14" rx="2" /><Path d="M6 18h.01" /><Path d="M10 18h.01" /></>} />;
}
