import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CircleArrowRight(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="12" cy="12" r="10" /><Path d="m12 16 4-4-4-4" /><Path d="M8 12h8" /></>} />;
}
