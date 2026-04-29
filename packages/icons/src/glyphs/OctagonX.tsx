import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function OctagonX(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m15 9-6 6" /><Path d="M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z" /><Path d="m9 9 6 6" /></>} />;
}
