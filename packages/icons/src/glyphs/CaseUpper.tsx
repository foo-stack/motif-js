import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CaseUpper(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5" /><Path d="m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" /><Path d="M3.304 13h6.392" /></>} />;
}
