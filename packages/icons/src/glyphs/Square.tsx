import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Square(props: IconProps): ReactElement {
  return (
    <Icon {...props} render={({ Rect }) => <Rect width="18" height="18" x="3" y="3" rx="2" />} />
  );
}
