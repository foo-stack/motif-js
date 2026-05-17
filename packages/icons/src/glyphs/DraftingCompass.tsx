import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function DraftingCompass(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Circle, Path }) => (
        <>
          <Path d="m12.99 6.74 1.93 3.44" />
          <Path d="M19.136 12a10 10 0 0 1-14.271 0" />
          <Path d="m21 21-2.16-3.84" />
          <Path d="m3 21 8.02-14.26" />
          <Circle cx="12" cy="5" r="2" />
        </>
      )}
    />
  );
}
