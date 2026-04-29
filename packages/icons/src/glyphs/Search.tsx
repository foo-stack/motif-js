import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Search(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="m21 21-4.34-4.34" /><Circle cx="11" cy="11" r="8" /></>} />;
}
