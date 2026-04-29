import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function ListTodo(props: IconProps): ReactElement {
  return (
    <Icon
      {...props}
      render={({ Path, Rect }) => (
        <>
          <Path d="M13 5h8" />
          <Path d="M13 12h8" />
          <Path d="M13 19h8" />
          <Path d="m3 17 2 2 4-4" />
          <Rect x="3" y="4" width="6" height="6" rx="1" />
        </>
      )}
    />
  );
}
