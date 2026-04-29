import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FormInput(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Rect width="20" height="12" x="2" y="6" rx="2" />
          <Path d="M12 12h.01" />
          <Path d="M17 12h.01" />
          <Path d="M7 12h.01" />
        </>
      )}
    />
  );
}
