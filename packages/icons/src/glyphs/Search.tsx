import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Search(props: IconProps): ReactElement {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  );
}
