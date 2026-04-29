import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ImagePlay(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M15 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z" /><Path d="M21 12.17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /><Path d="m6 21 5-5" /><Circle cx="9" cy="9" r="2" /></>} />;
}
