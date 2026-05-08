import { Box } from '@motif-js/react';
import type { ReactNode } from 'react';

const STATUS_TONE: Record<'stable' | 'beta', { color: string; bg: string; borderColor: string }> = {
  stable: {
    color: '$colors.status.success',
    bg: '$colors.status.successSoft',
    borderColor: 'color-mix(in oklab, var(--colors-status-success) 30%, transparent)',
  },
  beta: {
    color: '$colors.status.warning',
    bg: '$colors.status.warningSoft',
    borderColor: 'color-mix(in oklab, var(--colors-status-warning) 30%, transparent)',
  },
};

export interface ApiParam {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  description: ReactNode;
}

export interface ApiSignatureProps {
  name: string;
  signature: string;
  status?: 'stable' | 'beta';
  params?: ApiParam[];
}

export function ApiSignature({ name, signature, status, params }: ApiSignatureProps) {
  return (
    <Box>
      <Box display="flex" alignItems="baseline" gap={14} mb={8} flexWrap="wrap">
        <Box
          as="h1"
          m={0}
          fontFamily="$fontFamilies.mono"
          fontWeight={500}
          fontSize="36px"
          lineHeight={1.05}
          letterSpacing="-0.01em"
          color="$colors.fg.strong"
        >
          {name}
        </Box>
        {status ? <StatusTag status={status} /> : null}
      </Box>
      <Box
        as="pre"
        m={0}
        mb={24}
        py={16}
        px={20}
        bg="$colors.surface.paper2"
        borderStyle="solid"
        borderWidth={1}
        borderColor="$colors.line.base"
        borderRadius="8px"
        color="$colors.fg.strong"
        overflowX="auto"
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="14px"
        lineHeight={1.6}
        style={{ whiteSpace: 'pre' }}
      >
        {signature}
      </Box>
      {params && params.length > 0 ? (
        <Box
          mt={8}
          mb={24}
          borderTopStyle="solid"
          borderTopWidth={1}
          borderTopColor="$colors.line.faint"
        >
          {params.map((p) => (
            <Param key={p.name} param={p} />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function StatusTag({ status }: { status: 'stable' | 'beta' }) {
  const tone = STATUS_TONE[status];
  return (
    <Box
      as="span"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="10.5px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.1em"
      py="4px"
      px="7px"
      borderRadius="4px"
      borderStyle="solid"
      borderWidth={1}
      color={tone.color}
      bg={tone.bg}
      borderColor={tone.borderColor}
    >
      {status}
    </Box>
  );
}

function Param({ param }: { param: ApiParam }) {
  return (
    <Box
      display="grid"
      py={16}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderBottomColor="$colors.line.faint"
      style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}
    >
      <Box display="flex" alignItems="baseline" gap={10} flexWrap="wrap" mb={6}>
        <Box
          as="span"
          fontFamily="$fontFamilies.mono"
          fontWeight={500}
          fontSize="14px"
          lineHeight={1}
          color="$colors.fg.strong"
        >
          {param.name}
        </Box>
        <Box
          as="span"
          fontFamily="$fontFamilies.mono"
          fontWeight={400}
          fontSize="12.5px"
          lineHeight={1}
          color="$colors.accent.muted"
        >
          {param.type}
        </Box>
        {param.required ? (
          <Box
            as="span"
            fontFamily="$fontFamilies.mono"
            fontWeight={500}
            fontSize="10px"
            lineHeight={1}
            textTransform="uppercase"
            letterSpacing="0.1em"
            py="2px"
            px="5px"
            borderRadius="3px"
            bg="$colors.status.errorSoft"
            color="$colors.status.error"
          >
            required
          </Box>
        ) : null}
        {param.default ? (
          <Box
            as="span"
            fontFamily="$fontFamilies.mono"
            fontWeight={400}
            fontSize="12px"
            lineHeight={1}
            color="$colors.fg.faint"
          >
            = {param.default}
          </Box>
        ) : null}
      </Box>
      <Box
        as="p"
        m={0}
        fontFamily="$fontFamilies.sans"
        fontWeight={400}
        fontSize="14.5px"
        lineHeight={1.55}
        color="$colors.fg.muted"
        className="docs-param-desc"
      >
        {param.description}
      </Box>
    </Box>
  );
}
