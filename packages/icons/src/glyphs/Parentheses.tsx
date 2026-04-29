import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Parentheses(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M8 21s-4-3-4-9 4-9 4-9" />
          <Path d="M16 3s4 3 4 9-4 9-4 9" />
        </>
      )}
    />
  );
}
