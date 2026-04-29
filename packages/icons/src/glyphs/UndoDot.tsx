import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function UndoDot(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M21 17a9 9 0 0 0-15-6.7L3 13" /><Path d="M3 7v6h6" /><Circle cx="12" cy="17" r="1" /></>} />;
}
