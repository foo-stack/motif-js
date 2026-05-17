import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function MonitorCog(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M12 17v4" />
          <Path d="m14.305 7.53.923-.382" />
          <Path d="m15.228 4.852-.923-.383" />
          <Path d="m16.852 3.228-.383-.924" />
          <Path d="m16.852 8.772-.383.923" />
          <Path d="m19.148 3.228.383-.924" />
          <Path d="m19.53 9.696-.382-.924" />
          <Path d="m20.772 4.852.924-.383" />
          <Path d="m20.772 7.148.924.383" />
          <Path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
          <Path d="M8 21h8" />
          <Circle cx="18" cy="6" r="3" />
        </>
      )}
    />
  );
}
