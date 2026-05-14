import { Icon, type IconProps } from '@usemotif/react';
import type { ReactElement } from 'react';

export function FileCog(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="M15 8a1 1 0 0 1-1-1V2a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8z" />
          <Path d="M20 8v12a2 2 0 0 1-2 2h-4.182" />
          <Path d="m3.305 19.53.923-.382" />
          <Path d="M4 10.592V4a2 2 0 0 1 2-2h8" />
          <Path d="m4.228 16.852-.924-.383" />
          <Path d="m5.852 15.228-.383-.923" />
          <Path d="m5.852 20.772-.383.924" />
          <Path d="m8.148 15.228.383-.923" />
          <Path d="m8.53 21.696-.382-.924" />
          <Path d="m9.773 16.852.922-.383" />
          <Path d="m9.773 19.148.922.383" />
          <Circle cx="7" cy="18" r="3" />
        </>
      )}
    />
  );
}
