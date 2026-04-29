import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ZodiacLeo(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M10 16c0-4-3-4.5-3-8a5 5 0 0 1 10 0c0 3.466-3 6.196-3 10a3 3 0 0 0 6 0" /><Circle cx="7" cy="16" r="3" /></>} />;
}
