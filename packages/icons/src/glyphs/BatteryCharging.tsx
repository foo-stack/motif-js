import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function BatteryCharging(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="m11 7-3 5h4l-3 5" />
          <Path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935" />
          <Path d="M22 14v-4" />
          <Path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936" />
        </>
      )}
    />
  );
}
