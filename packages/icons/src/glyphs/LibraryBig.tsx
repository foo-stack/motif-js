import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function LibraryBig(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="8" height="18" x="3" y="3" rx="1" /><Path d="M7 3v18" /><Path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" /></>} />;
}
