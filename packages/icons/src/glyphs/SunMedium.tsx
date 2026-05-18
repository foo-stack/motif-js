import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function SunMedium(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Circle cx="12" cy="12" r="4" />
          <Path d="M12 3v1" />
          <Path d="M12 20v1" />
          <Path d="M3 12h1" />
          <Path d="M20 12h1" />
          <Path d="m18.364 5.636-.707.707" />
          <Path d="m6.343 17.657-.707.707" />
          <Path d="m5.636 5.636.707.707" />
          <Path d="m17.657 17.657.707.707" />
        </>
      )}
    />
  );
}
