import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function DoorOpen(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M11 20H2" /><Path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z" /><Path d="M11 4H8a2 2 0 0 0-2 2v14" /><Path d="M14 12h.01" /><Path d="M22 20h-3" /></>} />;
}
