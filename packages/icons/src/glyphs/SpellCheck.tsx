import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function SpellCheck(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m6 16 6-12 6 12" /><Path d="M8 12h8" /><Path d="m16 20 2 2 4-4" /></>} />;
}
