import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ThermometerSnowflake(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m10 20-1.25-2.5L6 18" /><Path d="M10 4 8.75 6.5 6 6" /><Path d="M10.585 15H10" /><Path d="M2 12h6.5L10 9" /><Path d="M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" /><Path d="m4 10 1.5 2L4 14" /><Path d="m7 21 3-6-1.5-3" /><Path d="m7 3 3 6h2" /></>} />;
}
