import { Box } from '@motif-js/react';
import { useCallback, useId, useState } from 'react';
import { Check, Copy } from './icons.js';

const DEFAULT_COLOR = '#C2410C';
const DEFAULT_RADIUS = 6;
const DEFAULT_PX = 20;
const LABEL = 'Save changes';

const ROOT_STYLE = { fontFeatureSettings: 'normal' } as const;
const PRE_STYLE = { whiteSpace: 'pre' as const, tabSize: 2 as const };

export interface PlaygroundProps {
  initialColor?: string;
  initialRadius?: number;
  initialPx?: number;
}

export function Playground({
  initialColor = DEFAULT_COLOR,
  initialRadius = DEFAULT_RADIUS,
  initialPx = DEFAULT_PX,
}: PlaygroundProps = {}) {
  const [color, setColor] = useState(initialColor);
  const [radius, setRadius] = useState(initialRadius);
  const [px, setPx] = useState(initialPx);
  const [copied, setCopied] = useState(false);

  const code = buildSnippet(color, radius, px);
  const lines = code.split('\n');

  const onCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [code]);

  return (
    <Box
      mt={0}
      mb={28}
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderRadius="10px"
      bg="$colors.surface.paper2"
      overflow="hidden"
      style={ROOT_STYLE}
    >
      <Header copied={copied} onCopy={onCopy} />
      <Box display="grid" style={{ gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)' }}>
        <Editor lines={lines} />
        <Preview
          color={color}
          radius={radius}
          px={px}
          setColor={setColor}
          setRadius={setRadius}
          setPx={setPx}
        />
      </Box>
    </Box>
  );
}

function Header({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      px={14}
      py={10}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderBottomColor="$colors.line.faint"
      bg="$colors.surface.paper3"
    >
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        gap={8}
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="$colors.fg.faint"
      >
        <Box
          as="span"
          aria-hidden="true"
          w={6}
          h={6}
          borderRadius="50%"
          bg="$colors.accent.base"
          style={{
            boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-accent-base) 22%, transparent)',
          }}
        />
        Live playground
      </Box>
      <Box
        as="button"
        type="button"
        onClick={onCopy}
        aria-label="Copy snippet"
        display="inline-flex"
        alignItems="center"
        gap={6}
        py="5px"
        px="9px"
        borderRadius="5px"
        borderStyle="solid"
        borderWidth={1}
        borderColor="$colors.line.faint"
        bg="$colors.surface.paper"
        color="$colors.fg.muted"
        cursor="pointer"
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.08em"
        transition="all 120ms var(--easings-base)"
        _hover={{ color: '$colors.fg.strong', borderColor: '$colors.line.base' }}
      >
        {copied ? <Check width={12} height={12} /> : <Copy width={12} height={12} />}
        {copied ? 'Copied' : 'Copy'}
      </Box>
    </Box>
  );
}

function Editor({ lines }: { lines: readonly string[] }) {
  return (
    <Box
      bg="$colors.surface.paper2"
      borderRightStyle="solid"
      borderRightWidth={1}
      borderRightColor="$colors.line.faint"
      overflowX="auto"
      maxW="100%"
    >
      <Box
        as="pre"
        m={0}
        py={14}
        px={0}
        fontFamily="$fontFamilies.mono"
        fontWeight={400}
        fontSize="13px"
        lineHeight={1.7}
        color="$colors.fg.strong"
        style={PRE_STYLE}
      >
        {lines.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key -- editor lines are positional
          <Box key={i} as="span" display="grid" style={{ gridTemplateColumns: 'auto 1fr' }}>
            <Box
              as="span"
              px={14}
              color="$colors.fg.faint"
              style={{ userSelect: 'none', opacity: 0.55, textAlign: 'right', minWidth: '2.25ch' }}
            >
              {i + 1}
            </Box>
            <Box as="span" pr={14}>
              {line.length === 0 ? ' ' : line}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Preview({
  color,
  radius,
  px,
  setColor,
  setRadius,
  setPx,
}: {
  color: string;
  radius: number;
  px: number;
  setColor: (v: string) => void;
  setRadius: (v: number) => void;
  setPx: (v: number) => void;
}) {
  const previewLabelId = useId();
  return (
    <Box
      position="relative"
      bg="$colors.surface.paper"
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: 220, paddingBottom: 56 }}
    >
      <Box
        as="span"
        id={previewLabelId}
        position="absolute"
        top={12}
        left={14}
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="$colors.fg.faint"
      >
        Preview
      </Box>
      <Box
        as="button"
        type="button"
        aria-labelledby={previewLabelId}
        display="inline-flex"
        alignItems="center"
        gap={8}
        py="12px"
        fontFamily="$fontFamilies.sans"
        fontWeight={500}
        fontSize="14px"
        lineHeight={1}
        color="$colors.fg.onAccent"
        borderStyle="solid"
        borderWidth={1}
        borderColor="transparent"
        cursor="pointer"
        transition="filter 120ms var(--easings-base)"
        _hover={{}}
        style={{
          background: color,
          borderRadius: radius + 'px',
          paddingLeft: px + 'px',
          paddingRight: px + 'px',
        }}
      >
        <Check width={14} height={14} />
        {LABEL}
      </Box>

      <Box
        position="absolute"
        left={14}
        bottom={14}
        right={14}
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        alignItems="center"
        gap={16}
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.08em"
        color="$colors.fg.faint"
      >
        <ControlLabel label="bg">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            aria-label="Background color"
            style={{
              width: 22,
              height: 22,
              border: '1px solid var(--colors-line-base)',
              borderRadius: 4,
              padding: 0,
              background: 'none',
              cursor: 'pointer',
            }}
          />
        </ControlLabel>
        <ControlLabel label="radius">
          <input
            type="range"
            min={0}
            max={20}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            aria-label="Border radius in px"
            style={{ width: 64 }}
          />
          <Box as="span" color="$colors.fg.muted" style={{ minWidth: '2ch' }}>
            {radius}
          </Box>
        </ControlLabel>
        <ControlLabel label="px">
          <input
            type="range"
            min={8}
            max={40}
            value={px}
            onChange={(e) => setPx(Number(e.target.value))}
            aria-label="Horizontal padding in px"
            style={{ width: 64 }}
          />
          <Box as="span" color="$colors.fg.muted" style={{ minWidth: '2ch' }}>
            {px}
          </Box>
        </ControlLabel>
      </Box>
    </Box>
  );
}

function ControlLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box as="label" display="inline-flex" alignItems="center" gap={7}>
      {label}
      {children}
    </Box>
  );
}

function buildSnippet(color: string, radius: number, px: number): string {
  return `import { motif } from 'motif'

export const Button = motif.view({
  bg:     '${color}',
  color:  '$accent.fg',
  px:     ${px},
  py:     12,
  radius: ${radius},
  font:   '$ui',
  weight: 500,
})

<Button>${LABEL}</Button>`;
}
export default Playground;
