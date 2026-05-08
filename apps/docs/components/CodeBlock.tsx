import { Box } from '@motif-js/react';
import { useCallback, useState } from 'react';
import { Btn } from '../theme/chrome/Anchor.js';
import { Check, Copy, File } from './icons.js';

export interface CodeBlockTab {
  label: string;
  code: string;
  filename?: string;
}

export interface CodeBlockProps {
  filename?: string;
  code?: string;
  tabs?: CodeBlockTab[];
  highlightLines?: readonly number[];
  showCopy?: boolean;
}

export function CodeBlock({
  filename,
  code,
  tabs,
  highlightLines = [],
  showCopy = true,
}: CodeBlockProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const tabSet = tabs && tabs.length > 0;
  const activeIndex = tabSet ? Math.min(activeTab, tabs.length - 1) : 0;
  const current = tabSet ? tabs[activeIndex] : { code: code ?? '', filename };
  const lines = (current?.code ?? '').split('\n');

  const onCopy = useCallback(() => {
    const text = current?.code ?? '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [current?.code]);

  const selectTab = useCallback((i: number) => () => setActiveTab(i), []);

  return (
    <Box
      bg="$colors.surface.paper2"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderRadius="8px"
      overflow="hidden"
      mt={0}
      mb={22}
      mx={0}
    >
      <Box
        display="flex"
        alignItems="stretch"
        borderBottomStyle="solid"
        borderBottomWidth={1}
        borderBottomColor="$colors.line.faint"
        style={{
          background:
            'color-mix(in oklab, var(--colors-surface-paper2) 60%, var(--colors-surface-paper3))',
        }}
      >
        {tabSet ? (
          <Box display="flex" role="tablist">
            {tabs.map((t, i) => (
              <CodeTab
                key={t.label}
                active={i === activeIndex}
                onClick={selectTab(i)}
                label={t.label}
              />
            ))}
          </Box>
        ) : (
          <Box
            display="inline-flex"
            alignItems="center"
            gap={8}
            py={11}
            px={16}
            fontFamily="$fontFamilies.mono"
            fontWeight={400}
            fontSize="12px"
            lineHeight={1}
            color="$colors.fg.muted"
          >
            <File width={12} height={12} opacity={0.6} />
            {current?.filename ?? 'example.tsx'}
          </Box>
        )}
        {showCopy ? (
          <Box ml="auto" display="flex" alignItems="center" gap="2px" p="6px">
            <Btn
              type="button"
              onClick={onCopy}
              display="inline-flex"
              alignItems="center"
              gap={5}
              fontFamily="$fontFamilies.mono"
              fontWeight={500}
              fontSize="11px"
              lineHeight={1}
              color={copied ? '$colors.status.success' : '$colors.fg.faint'}
              bg="transparent"
              borderWidth={0}
              borderRadius="4px"
              py="5px"
              px="7px"
              cursor="pointer"
              transition="all 120ms var(--easings-base)"
              _hover={{ bg: '$colors.surface.paper', color: '$colors.fg.strong' }}
            >
              {copied ? <Check width={12} height={12} /> : <Copy width={12} height={12} />}
              {copied ? 'Copied' : 'Copy'}
            </Btn>
          </Box>
        ) : null}
      </Box>
      <Box position="relative">
        <Box
          as="pre"
          m={0}
          py={16}
          px={0}
          fontFamily="$fontFamilies.mono"
          fontWeight={400}
          fontSize="13.5px"
          lineHeight={1.65}
          color="$colors.fg.strong"
          overflowX="auto"
          bg="transparent"
          borderWidth={0}
          borderRadius={0}
        >
          <code>
            {lines.map((ln, i) => (
              <Box
                as="span"
                // eslint-disable-next-line react/no-array-index-key -- code lines are positional and have no stable id.
                key={i}
                display="block"
                px="18px"
                position="relative"
                style={{
                  whiteSpace: 'pre',
                  ...(highlightLines.includes(i)
                    ? {
                        background:
                          'color-mix(in oklab, var(--colors-accent-base) 9%, transparent)',
                        boxShadow: 'inset 2px 0 0 var(--colors-accent-base)',
                      }
                    : {}),
                }}
              >
                {ln || ' '}
                {'\n'}
              </Box>
            ))}
          </code>
        </Box>
      </Box>
    </Box>
  );
}

function CodeTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Btn
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      position="relative"
      display="inline-flex"
      alignItems="center"
      gap={6}
      py={11}
      px={16}
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.1em"
      color={active ? '$colors.fg.strong' : '$colors.fg.faint'}
      bg={active ? '$colors.surface.paper2' : 'transparent'}
      borderWidth={0}
      borderRightStyle="solid"
      borderRightWidth={1}
      borderRightColor="$colors.line.faint"
      cursor="pointer"
      transition="all 120ms var(--easings-base)"
      {...(active
        ? {
            _after: {
              content: '""',
              position: 'absolute',
              bottom: '-1px',
              left: 0,
              right: 0,
              h: '1px',
              bg: '$colors.surface.paper2',
            },
          }
        : { _hover: { color: '$colors.fg.muted' } })}
    >
      {label}
    </Btn>
  );
}
