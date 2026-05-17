import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function UserCog2(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m14.305 19.53.923-.382" />
          <Path d="m15.228 16.852-.923-.383" />
          <Path d="m16.852 15.228-.383-.923" />
          <Path d="m16.852 20.772-.383.924" />
          <Path d="m19.148 15.228.383-.923" />
          <Path d="m19.53 21.696-.382-.924" />
          <Path d="M2 21a8 8 0 0 1 10.434-7.62" />
          <Path d="m20.772 16.852.924-.383" />
          <Path d="m20.772 19.148.924.383" />
          <Circle cx="10" cy="8" r="5" />
          <Circle cx="18" cy="18" r="3" />
        </>
      )}
    />
  );
}
