import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Transgender(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M12 16v6" /><Path d="M14 20h-4" /><Path d="M18 2h4v4" /><Path d="m2 2 7.17 7.17" /><Path d="M2 5.355V2h3.357" /><Path d="m22 2-7.17 7.17" /><Path d="M8 5 5 8" /><Circle cx="12" cy="12" r="4" /></>} />;
}
