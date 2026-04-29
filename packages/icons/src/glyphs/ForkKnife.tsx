import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ForkKnife(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><Path d="M7 2v20" /><Path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></>} />;
}
