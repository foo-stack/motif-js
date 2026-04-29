import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Settings2(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M14 17H5" /><Path d="M19 7h-9" /><Circle cx="17" cy="17" r="3" /><Circle cx="7" cy="7" r="3" /></>} />;
}
