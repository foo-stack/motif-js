import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WavesHorizontal(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M2 12q2.5 2 5 0t5 0 5 0 5 0" /><Path d="M2 19q2.5 2 5 0t5 0 5 0 5 0" /><Path d="M2 5q2.5 2 5 0t5 0 5 0 5 0" /></>} />;
}
