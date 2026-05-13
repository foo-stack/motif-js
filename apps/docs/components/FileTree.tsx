import { Box } from 'usemotif';
import type { ReactNode } from 'react';

const TREE_BASE = {
  fontFamily: '$fontFamilies.mono' as const,
  fontWeight: 400,
  fontSize: '13px',
  lineHeight: 1.6,
  color: '$colors.fg.muted' as const,
};

export interface FileTreeProps {
  children: ReactNode;
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <Box
      aria-label="File tree"
      bg="$colors.surface.paper2"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.faint"
      borderRadius="6px"
      py={16}
      px={20}
      my={22}
      overflowX="auto"
      {...TREE_BASE}
    >
      <Box as="ul" m={0} p={0} style={{ listStyle: 'none' }}>
        {children}
      </Box>
    </Box>
  );
}

export interface FileTreeDirProps {
  name: string;
  children: ReactNode;
  note?: string;
}

export function FileTreeDir({ name, children, note }: FileTreeDirProps) {
  return (
    <Box as="li" position="relative" py="1px" style={{ listStyle: 'none' }}>
      <Box as="span" color="$colors.fg.strong">
        <Box as="span" color="$colors.fg.faint">
          ▾{' '}
        </Box>
        {name}
      </Box>
      {note ? <FileTreeNote>{note}</FileTreeNote> : null}
      <Box
        as="ul"
        m={0}
        ml="6px"
        pl={18}
        borderLeftStyle="dashed"
        borderLeftWidth={1}
        borderLeftColor="$colors.line.faint"
        style={{ listStyle: 'none' }}
      >
        {children}
      </Box>
    </Box>
  );
}

export interface FileTreeFileProps {
  name: string;
  note?: string;
}

export function FileTreeFile({ name, note }: FileTreeFileProps) {
  return (
    <Box as="li" position="relative" py="1px" style={{ listStyle: 'none' }}>
      <Box as="span">
        <Box as="span" color="$colors.fg.faint">
          ·{' '}
        </Box>
        {name}
      </Box>
      {note ? <FileTreeNote>{note}</FileTreeNote> : null}
    </Box>
  );
}

function FileTreeNote({ children }: { children: ReactNode }) {
  return (
    <Box
      as="span"
      ml="6px"
      fontFamily="$fontFamilies.mono"
      fontWeight={400}
      color="$colors.fg.faint"
      style={{ fontSize: '0.85em' }}
    >
      {children}
    </Box>
  );
}
