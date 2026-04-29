import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Helicopter(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M11 17v4" /><Path d="M14 3v8a2 2 0 0 0 2 2h5.865" /><Path d="M17 17v4" /><Path d="M18 17a4 4 0 0 0 4-4 8 6 0 0 0-8-6 6 5 0 0 0-6 5v3a2 2 0 0 0 2 2z" /><Path d="M2 10v5" /><Path d="M6 3h16" /><Path d="M7 21h14" /><Path d="M8 13H2" /></>} />;
}
