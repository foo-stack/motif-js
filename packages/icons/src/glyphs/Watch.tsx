import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Watch(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M12 10v2.2l1.6 1" /><Path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" /><Path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" /><Circle cx="12" cy="12" r="6" /></>} />;
}
