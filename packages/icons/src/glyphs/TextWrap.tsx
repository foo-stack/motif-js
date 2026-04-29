import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TextWrap(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m16 16-3 3 3 3" /><Path d="M3 12h14.5a1 1 0 0 1 0 7H13" /><Path d="M3 19h6" /><Path d="M3 5h18" /></>} />;
}
