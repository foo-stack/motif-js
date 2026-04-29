import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function AlarmSmoke(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M11 21c0-2.5 2-2.5 2-5" /><Path d="M16 21c0-2.5 2-2.5 2-5" /><Path d="m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8" /><Path d="M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z" /><Path d="M6 21c0-2.5 2-2.5 2-5" /></>} />;
}
