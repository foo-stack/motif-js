import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Landmark(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path }) => (
        <>
          <Path d="M10 18v-7" />
          <Path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />
          <Path d="M14 18v-7" />
          <Path d="M18 18v-7" />
          <Path d="M3 22h18" />
          <Path d="M6 18v-7" />
        </>
      )}
    />
  );
}
