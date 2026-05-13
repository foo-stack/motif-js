import { Box } from 'usemotif';
import type { ReactNode } from 'react';
import { ArrowRight } from '../chrome/icons.js';
import { DocAnchorBtn } from './_DocBtn.js';
import { LandingSection, SectionHead, TitleEm } from './_LandingSection.js';

const VERSION_AXES = { opsz: 36 } as const;
const TITLE_AXES = { opsz: 36 } as const;

export function ChangelogPeek() {
  return (
    <LandingSection>
      <SectionHead
        eye="Recent"
        title={
          <>
            Shipped <TitleEm>this week</TitleEm>.
          </>
        }
        sub="Motion, theming, compiler work landed on April 30. Read the full changelog for the why behind every change."
      />

      <Box mx="auto">
        <ChangelogEntry
          first
          date="Apr 30, 2026"
          version="v1.1.2"
          tag="Latest"
          chip={{ label: 'Fix', kind: 'fix' }}
          title="SWC compiler emits aggregated CSS via virtual module"
        >
          <ChangelogParagraph>
            Apps using the SWC plugin no longer have to wire the emitted style sheet by hand. The
            publish pipeline also rewrites <ChangelogCode>workspace:*</ChangelogCode> deps cleanly.
          </ChangelogParagraph>
        </ChangelogEntry>

        <ChangelogEntry
          date="Apr 30, 2026"
          version="v1.1.0"
          chip={{ label: 'Feature', kind: 'feat' }}
          title="Motion, theming, and compiler stabilisation"
        >
          <ChangelogParagraph>
            Web and native mount/unmount transitions, Reanimated UI-thread driver, chainable
            sub-themes, fallback variants, <ChangelogCode>@motif-js/reset</ChangelogCode>, icons v2
            with 1,932 lucide glyphs, the Phase G compiler extension pass.
          </ChangelogParagraph>
        </ChangelogEntry>
      </Box>

      <Box mt={32} textAlign="center">
        <DocAnchorBtn variant="ghost" href="/changelog">
          See full changelog <ArrowRight />
        </DocAnchorBtn>
      </Box>
    </LandingSection>
  );
}

function ChangelogEntry({
  first,
  date,
  version,
  tag,
  chip,
  title,
  children,
}: {
  first?: boolean;
  date: string;
  version: string;
  tag?: string;
  chip: { label: string; kind: 'feat' | 'fix' | 'brk' };
  title: string;
  children: ReactNode;
}) {
  return (
    <Box
      display="grid"
      gap={32}
      pt={first ? 0 : 32}
      pb={32}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderBottomColor="$colors.line.faint"
      style={{ gridTemplateColumns: '140px 1fr' }}
    >
      <Box>
        <Box
          fontFamily="$fontFamilies.mono"
          fontWeight={500}
          fontSize="12px"
          lineHeight={1.4}
          color="$colors.fg.faint"
          textTransform="uppercase"
          letterSpacing="0.1em"
        >
          {date}
        </Box>
        <Box
          mt={4}
          fontFamily="$fontFamilies.display"
          fontWeight={600}
          fontSize="24px"
          lineHeight={1.2}
          color="$colors.fg.strong"
          fontVariationSettings={VERSION_AXES}
        >
          {version}
        </Box>
        {tag === undefined ? null : (
          <Box
            display="inline-block"
            mt="6px"
            fontFamily="$fontFamilies.mono"
            fontWeight={500}
            fontSize="9.5px"
            lineHeight={1}
            textTransform="uppercase"
            letterSpacing="0.1em"
            py="4px"
            px="6px"
            bg="$colors.accent.soft"
            color="$colors.accent.muted"
            borderRadius="4px"
          >
            {tag}
          </Box>
        )}
      </Box>
      <Box>
        <Box
          display="flex"
          alignItems="center"
          gap={10}
          mb={12}
          fontFamily="$fontFamilies.mono"
          fontWeight={500}
          fontSize="11px"
          lineHeight={1}
          textTransform="uppercase"
          letterSpacing="0.1em"
          color="$colors.fg.faint"
        >
          <ChangelogChip kind={chip.kind}>{chip.label}</ChangelogChip>
        </Box>
        <Box
          as="h3"
          m={0}
          mb={10}
          fontFamily="$fontFamilies.display"
          fontWeight={600}
          fontSize="22px"
          lineHeight={1.3}
          color="$colors.fg.strong"
          fontVariationSettings={TITLE_AXES}
        >
          {title}
        </Box>
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}

function ChangelogParagraph({ children }: { children: ReactNode }) {
  return (
    <Box
      as="p"
      m={0}
      mb={12}
      fontFamily="$fontFamilies.sans"
      fontWeight={400}
      fontSize="15.5px"
      lineHeight={1.65}
      color="$colors.fg.base"
    >
      {children}
    </Box>
  );
}

function ChangelogCode({ children }: { children: ReactNode }) {
  return (
    <Box
      as="code"
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      bg="$colors.surface.paper2"
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.faint"
      borderRadius="3px"
      color="$colors.fg.strong"
      style={{ fontSize: '0.9em', padding: '0.06em 0.34em' }}
    >
      {children}
    </Box>
  );
}

function ChangelogChip({ kind, children }: { kind: 'feat' | 'fix' | 'brk'; children: ReactNode }) {
  const styles =
    kind === 'feat'
      ? {
          color: '$colors.status.success' as const,
          bg: '$colors.status.successSoft' as const,
          borderColor:
            'color-mix(in oklab, var(--colors-status-success) 30%, transparent)' as const,
        }
      : kind === 'fix'
        ? {
            color: '$colors.status.info' as const,
            bg: '$colors.status.infoSoft' as const,
            borderColor: 'color-mix(in oklab, var(--colors-status-info) 30%, transparent)' as const,
          }
        : {
            color: '$colors.status.error' as const,
            bg: '$colors.status.errorSoft' as const,
            borderColor:
              'color-mix(in oklab, var(--colors-status-error) 30%, transparent)' as const,
          };
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap={5}
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="10.5px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.08em"
      py="4px"
      px="7px"
      borderRadius="4px"
      borderStyle="solid"
      borderWidth={1}
      {...styles}
    >
      {children}
    </Box>
  );
}
