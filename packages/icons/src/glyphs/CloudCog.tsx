import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudCog(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m10.852 19.772-.383.924" /><Path d="m13.148 14.228.383-.923" /><Path d="M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923" /><Path d="m13.53 20.696-.382-.924a3 3 0 1 1-2.296-5.544" /><Path d="m14.772 15.852.923-.383" /><Path d="m14.772 18.148.923.383" /><Path d="M4.2 15.1a7 7 0 1 1 9.93-9.858A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" /><Path d="m9.228 15.852-.923-.383" /><Path d="m9.228 18.148-.923.383" /></>} />;
}
