import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FolderCog(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3" /><Path d="m14.305 19.53.923-.382" /><Path d="m15.228 16.852-.923-.383" /><Path d="m16.852 15.228-.383-.923" /><Path d="m16.852 20.772-.383.924" /><Path d="m19.148 15.228.383-.923" /><Path d="m19.53 21.696-.382-.924" /><Path d="m20.772 16.852.924-.383" /><Path d="m20.772 19.148.924.383" /><Circle cx="18" cy="18" r="3" /></>} />;
}
