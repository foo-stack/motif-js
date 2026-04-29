import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function NotepadText(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Path d="M8 2v4" /><Path d="M12 2v4" /><Path d="M16 2v4" /><Rect width="16" height="18" x="4" y="4" rx="2" /><Path d="M8 10h6" /><Path d="M8 14h8" /><Path d="M8 18h5" /></>} />;
}
