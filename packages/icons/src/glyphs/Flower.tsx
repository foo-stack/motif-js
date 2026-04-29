import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Flower(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="12" cy="12" r="3" /><Path d="M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5" /><Path d="M12 7.5V9" /><Path d="M7.5 12H9" /><Path d="M16.5 12H15" /><Path d="M12 16.5V15" /><Path d="m8 8 1.88 1.88" /><Path d="M14.12 9.88 16 8" /><Path d="m8 16 1.88-1.88" /><Path d="M14.12 14.12 16 16" /></>} />;
}
