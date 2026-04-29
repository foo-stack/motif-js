import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TvMinimalPlay(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z" /><Path d="M7 21h10" /><Rect width="20" height="14" x="2" y="3" rx="2" /></>} />;
}
