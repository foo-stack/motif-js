import { Box } from 'usemotif';
import type { ReactNode } from 'react';

export interface LedeProps {
  children: ReactNode;
}

export function Lede({ children }: LedeProps) {
  return (
    <Box
      as="p"
      m={0}
      maxW={600}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="19px"
      lineHeight={1.55}
      color="$colors.fg.muted"
      style={{ textWrap: 'pretty' }}
    >
      {children}
    </Box>
  );
}
