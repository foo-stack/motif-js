import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Vault(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Rect width="18" height="18" x="3" y="3" rx="2" /><Circle cx="7.5" cy="7.5" r=".5" fill="currentColor" /><Path d="m7.9 7.9 2.7 2.7" /><Circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /><Path d="m13.4 10.6 2.7-2.7" /><Circle cx="7.5" cy="16.5" r=".5" fill="currentColor" /><Path d="m7.9 16.1 2.7-2.7" /><Circle cx="16.5" cy="16.5" r=".5" fill="currentColor" /><Path d="m13.4 13.4 2.7 2.7" /><Circle cx="12" cy="12" r="2" /></>} />;
}
