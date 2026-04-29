import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Banknote(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path, Rect }) => <><Rect width="20" height="12" x="2" y="6" rx="2" /><Circle cx="12" cy="12" r="2" /><Path d="M6 12h.01M18 12h.01" /></>} />;
}
