import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function MonitorSpeaker(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Path d="M5.5 20H8" /><Path d="M17 9h.01" /><Rect width="10" height="16" x="12" y="4" rx="2" /><Path d="M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4" /><Circle cx="17" cy="15" r="1" /></>} />;
}
