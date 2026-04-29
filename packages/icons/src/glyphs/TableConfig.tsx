import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TableConfig(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" /><Path d="m14.3 19.6 1-.4" /><Path d="M15 3v7.5" /><Path d="m15.2 16.9-.9-.3" /><Path d="m16.6 21.7.3-.9" /><Path d="m16.8 15.3-.4-1" /><Path d="m19.1 15.2.3-.9" /><Path d="m19.6 21.7-.4-1" /><Path d="m20.7 16.8 1-.4" /><Path d="m21.7 19.4-.9-.3" /><Path d="M9 3v18" /><Circle cx="18" cy="18" r="3" /></>} />;
}
