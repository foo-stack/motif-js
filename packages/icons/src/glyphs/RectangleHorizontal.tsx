import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function RectangleHorizontal(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Rect }) => <Rect width="20" height="12" x="2" y="6" rx="2" />} />;
}
