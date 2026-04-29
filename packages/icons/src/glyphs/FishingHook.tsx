import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function FishingHook(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Circle, Path }) => <><Path d="m17.586 11.414-5.93 5.93a1 1 0 0 1-8-8l3.137-3.137a.707.707 0 0 1 1.207.5V10" /><Path d="M20.414 8.586 22 7" /><Circle cx="19" cy="10" r="2" /></>} />;
}
