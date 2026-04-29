import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Signpost(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M12 13v8" /><Path d="M12 3v3" /><Path d="M2.354 10.354a1.207 1.207 0 0 1 0-1.708l2.06-2.06A2 2 0 0 1 5.828 6h12.344a2 2 0 0 1 1.414.586l2.06 2.06a1.207 1.207 0 0 1 0 1.708l-2.06 2.06a2 2 0 0 1-1.414.586H5.828a2 2 0 0 1-1.414-.586z" /></>} />;
}
