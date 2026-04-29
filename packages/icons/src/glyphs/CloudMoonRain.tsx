import { Icon, type IconProps } from '@motif-js/react';
import type { ReactElement } from 'react';

export function CloudMoonRain(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <><Path d="M11 20v2" /><Path d="M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36" /><Path d="M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" /><Path d="M7 19v2" /></>} />;
}
