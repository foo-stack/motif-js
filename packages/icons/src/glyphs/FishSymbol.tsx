import { Icon, type IconProps } from '@usemotif/react/svg';
import type { ReactElement } from 'react';

export function FishSymbol(props: IconProps): ReactElement {
  return <Icon {...props} render={({ Path }) => <Path d="M2 16s9-15 20-4C11 23 2 8 2 8" />} />;
}
