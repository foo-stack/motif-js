import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function RectangleVertical(props: IconProps): ReactElement {
  return (
    <Icon {...props} render={({ Rect }) => <Rect width="12" height="20" x="6" y="2" rx="2" />} />
  );
}
