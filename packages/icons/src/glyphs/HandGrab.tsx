import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function HandGrab(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" /><Path d="M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" /><Path d="M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5" /><Path d="M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2" /><Path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0" /></>} />;
}
