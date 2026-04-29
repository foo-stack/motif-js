import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function GalleryThumbnails(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path, Rect }) => <><Rect width="18" height="14" x="3" y="3" rx="2" /><Path d="M4 21h1" /><Path d="M9 21h1" /><Path d="M14 21h1" /><Path d="M19 21h1" /></>} />;
}
