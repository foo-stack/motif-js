import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function TentTree(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Circle cx="4" cy="4" r="2" /><Path d="m14 5 3-3 3 3" /><Path d="m14 10 3-3 3 3" /><Path d="M17 14V2" /><Path d="M17 14H7l-5 8h20Z" /><Path d="M8 14v8" /><Path d="m9 14 5 8" /></>} />;
}
