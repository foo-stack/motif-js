import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CassetteTape(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Rect width="20" height="16" x="2" y="4" rx="2" /><Circle cx="8" cy="10" r="2" /><Path d="M8 12h8" /><Circle cx="16" cy="10" r="2" /><Path d="m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3" /></>} />;
}
