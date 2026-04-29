import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Music3(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="12" cy="18" r="4" /><Path d="M16 18V2" /></>} />;
}
