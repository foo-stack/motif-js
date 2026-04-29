import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function PocketKnife(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2" /><Path d="M18 6h.01" /><Path d="M6 18h.01" /><Path d="M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z" /><Path d="M18 11.66V22a4 4 0 0 0 4-4V6" /></>} />;
}
