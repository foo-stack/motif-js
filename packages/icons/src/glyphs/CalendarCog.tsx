import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CalendarCog(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="m15.228 16.852-.923-.383" /><Path d="m15.228 19.148-.923.383" /><Path d="M16 2v4" /><Path d="m16.47 14.305.382.923" /><Path d="m16.852 20.772-.383.924" /><Path d="m19.148 15.228.383-.923" /><Path d="m19.53 21.696-.382-.924" /><Path d="m20.772 16.852.924-.383" /><Path d="m20.772 19.148.924.383" /><Path d="M21 10.592V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /><Path d="M3 10h18" /><Path d="M8 2v4" /><Circle cx="18" cy="18" r="3" /></>} />;
}
