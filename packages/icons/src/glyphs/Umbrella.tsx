import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Umbrella(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 13v7a2 2 0 0 0 4 0" /><Path d="M12 2v2" /><Path d="M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z" /></>} />;
}
