import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function WifiCog(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="m14.305 19.53.923-.382" /><Path d="m15.228 16.852-.923-.383" /><Path d="m16.852 15.228-.383-.923" /><Path d="m16.852 20.772-.383.924" /><Path d="m19.148 15.228.383-.923" /><Path d="m19.53 21.696-.382-.924" /><Path d="M2 7.82a15 15 0 0 1 20 0" /><Path d="m20.772 16.852.924-.383" /><Path d="m20.772 19.148.924.383" /><Path d="M5 11.858a10 10 0 0 1 11.5-1.785" /><Path d="M8.5 15.429a5 5 0 0 1 2.413-1.31" /><Circle cx="18" cy="18" r="3" /></>} />;
}
