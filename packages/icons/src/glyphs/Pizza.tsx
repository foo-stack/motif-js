import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function Pizza(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="m12 14-1 1" /><Path d="m13.75 18.25-1.25 1.42" /><Path d="M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12" /><Path d="M18.8 9.3a1 1 0 0 0 2.1 7.7" /><Path d="M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z" /></>} />;
}
