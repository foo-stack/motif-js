import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Network(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect x="16" y="16" width="6" height="6" rx="1" />
          <Rect x="2" y="16" width="6" height="6" rx="1" />
          <Rect x="9" y="2" width="6" height="6" rx="1" />
          <Path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
          <Path d="M12 12V8" />
        </>
      )}
    />
  );
}
