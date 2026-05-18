import { Box } from 'usemotif';
import type { ReactNode } from 'react';
import { Anchor, Btn } from '../chrome/Anchor.js';
import { LandingSection, SectionHead, TitleEm } from './_LandingSection.js';

const TITLE_AXES = { opsz: 36 } as const;

export function ComponentGallery() {
  return (
    <LandingSection>
      <SectionHead
        eye="Components"
        title={
          <>
            A starter library, <TitleEm>not</TitleEm> a UI kit.
          </>
        }
        sub="Headless and styled primitives ship with motif. Use them as-is, restyle them, or ignore them entirely — whatever suits your design."
      />

      <Box
        display="grid"
        gridTemplateColumns={{
          base: 'minmax(0, 1fr)',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={16}
      >
        <GalleryCard
          href="/components/interactive/button"
          title="Buttons"
          count="3 variants · 4 intents"
        >
          <Box display="flex" gap={8}>
            <DemoBtn variant="primary">Save</DemoBtn>
            <DemoBtn variant="secondary">Cancel</DemoBtn>
            <DemoBtn variant="ghost">Skip</DemoBtn>
          </Box>
        </GalleryCard>

        <GalleryCard
          href="/components/forms"
          title="Inputs"
          count="Field · Input · TextArea · NumberInput"
        >
          <DemoInput placeholder="Type a name…" defaultValue="Eleanor Ashbury" />
        </GalleryCard>

        <GalleryCard href="/components/layout" title="Cards" count="Surface · Stack · Heading">
          <Box
            w={200}
            p={14}
            bg="$colors.surface.paper2"
            borderStyle="solid"
            borderWidth={1}
            borderColor="$colors.line.faint"
            borderRadius="8px"
          >
            <Box
              mb="6px"
              fontFamily="$fontFamilies.mono"
              fontWeight={500}
              fontSize="9.5px"
              lineHeight={1}
              color="$colors.fg.faint"
              textTransform="uppercase"
              letterSpacing="0.1em"
            >
              Project
            </Box>
            <Box
              mb={4}
              fontFamily="$fontFamilies.display"
              fontWeight={600}
              fontSize="14px"
              lineHeight={1.2}
              color="$colors.fg.strong"
            >
              Q4 design review
            </Box>
            <Box
              fontFamily="$fontFamilies.sans"
              fontWeight={400}
              fontSize="11.5px"
              lineHeight={1.4}
              color="$colors.fg.muted"
            >
              Three working sessions across two weeks.
            </Box>
          </Box>
        </GalleryCard>

        <GalleryCard href="/concepts/variants" title="Badges" count="4 intents">
          <Box display="flex" gap={8}>
            <DemoBadge bg="$colors.status.successSoft" color="$colors.status.success">
              Live
            </DemoBadge>
            <DemoBadge bg="$colors.status.warningSoft" color="$colors.status.warning">
              Preview
            </DemoBadge>
            <DemoBadge bg="$colors.status.infoSoft" color="$colors.status.info">
              v1.0.0
            </DemoBadge>
          </Box>
        </GalleryCard>

        <GalleryCard href="/concepts/composition" title="Tabs" count="3 styles">
          <Box
            display="flex"
            bg="$colors.surface.paper2"
            borderStyle="solid"
            borderWidth={1}
            borderColor="$colors.line.faint"
            borderRadius="6px"
            p="3px"
          >
            <DemoTab active>Overview</DemoTab>
            <DemoTab>Activity</DemoTab>
            <DemoTab>Settings</DemoTab>
          </Box>
        </GalleryCard>

        <GalleryCard href="/headless/selection/switch" title="Toggles" count="Switch · checkbox">
          <Box display="inline-flex" alignItems="center" gap={8}>
            <Box
              as="span"
              fontFamily="$fontFamilies.sans"
              fontWeight={500}
              fontSize="12px"
              lineHeight={1}
              color="$colors.fg.strong"
            >
              Notifications
            </Box>
            <Box
              as="span"
              w={32}
              h={18}
              bg="$colors.accent.base"
              borderRadius="99px"
              position="relative"
              _after={{
                content: '""',
                position: 'absolute',
                top: '2px',
                right: '2px',
                w: 14,
                h: 14,
                bg: '$colors.accent.fg',
                borderRadius: '50%',
              }}
            />
          </Box>
        </GalleryCard>

        <GalleryCard href="/reference/styled" title="Avatars" count="Stack · group">
          <Box display="flex">
            <DemoAvatar bg="#C2410C" color="#FBF7F2">
              EA
            </DemoAvatar>
            <DemoAvatar bg="#7E6B43" color="#FBF7F2" stacked>
              JR
            </DemoAvatar>
            <DemoAvatar bg="#5B7553" color="#FBF7F2" stacked>
              MK
            </DemoAvatar>
            <DemoAvatar bg="$colors.surface.paper3" color="$colors.fg.strong" stacked>
              +4
            </DemoAvatar>
          </Box>
        </GalleryCard>

        <GalleryCard href="/headless/numeric/progress" title="Progress" count="Bar · ring">
          <Box display="flex" flexDirection="column" gap={6} w={200}>
            <Box h={8} bg="$colors.surface.paper3" borderRadius="4px" overflow="hidden">
              <Box w="64%" h="100%" bg="$colors.accent.base" />
            </Box>
            <Box
              fontFamily="$fontFamilies.mono"
              fontWeight={500}
              fontSize="10.5px"
              lineHeight={1}
              color="$colors.fg.faint"
              textTransform="uppercase"
              letterSpacing="0.08em"
            >
              64% · 320 of 500
            </Box>
          </Box>
        </GalleryCard>

        <GalleryCard href="/headless/feedback/toast" title="Toasts" count="4 variants">
          <Box
            display="flex"
            alignItems="center"
            gap={8}
            py={10}
            px={14}
            bg="$colors.surface.paper2"
            borderStyle="solid"
            borderWidth={1}
            borderColor="$colors.line.faint"
            borderRadius="6px"
            w={220}
          >
            <Box
              as="span"
              w={6}
              h={6}
              bg="$colors.status.success"
              borderRadius="50%"
              flexShrink={0}
            />
            <Box
              as="span"
              fontFamily="$fontFamilies.sans"
              fontWeight={500}
              fontSize="12.5px"
              lineHeight={1.3}
              color="$colors.fg.strong"
            >
              Deploy succeeded
            </Box>
          </Box>
        </GalleryCard>
      </Box>
    </LandingSection>
  );
}

function GalleryCard({
  href,
  title,
  count,
  children,
}: {
  href: string;
  title: string;
  count: string;
  children: ReactNode;
}) {
  return (
    <Anchor
      href={href}
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.faint"
      borderRadius="10px"
      bg="$colors.surface.paper2"
      overflow="hidden"
      transition="all 200ms var(--easings-base)"
      color="$colors.fg.base"
      display="flex"
      flexDirection="column"
      style={{ textDecoration: 'none' }}
      _hover={{ borderColor: '$colors.line.base' }}
    >
      <Box
        h={160}
        bg="$colors.surface.paper"
        borderBottomStyle="solid"
        borderBottomWidth={1}
        borderBottomColor="$colors.line.faint"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={24}
        style={{
          backgroundImage: 'radial-gradient(var(--colors-line-faint) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      >
        {children}
      </Box>
      <Box py={16} px={18} display="flex" alignItems="center" justifyContent="space-between">
        <Box
          as="span"
          fontFamily="$fontFamilies.display"
          fontWeight={600}
          fontSize="15px"
          lineHeight={1.2}
          color="$colors.fg.strong"
          fontVariationSettings={TITLE_AXES}
        >
          {title}
        </Box>
        <Box
          as="span"
          fontFamily="$fontFamilies.mono"
          fontWeight={500}
          fontSize="11px"
          lineHeight={1}
          color="$colors.fg.faint"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          {count}
        </Box>
      </Box>
    </Anchor>
  );
}

function DemoInput(props: { placeholder?: string; defaultValue?: string }) {
  return (
    <input
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      style={{
        padding: '8px 11px',
        fontFamily: 'var(--fontFamilies-sans)',
        fontWeight: 400,
        fontSize: '12.5px',
        lineHeight: 1,
        border: '1px solid var(--colors-line-base)',
        borderRadius: '5px',
        background: 'var(--colors-surface-paper)',
        color: 'var(--colors-fg-strong)',
        width: 180,
      }}
    />
  );
}

function DemoBtn({
  variant,
  children,
}: {
  variant: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
}) {
  const styles =
    variant === 'primary'
      ? { bg: '$colors.accent.base' as const, color: '$colors.accent.fg' as const, borderWidth: 0 }
      : variant === 'secondary'
        ? {
            bg: '$colors.surface.paper2' as const,
            color: '$colors.fg.strong' as const,
            borderWidth: 1,
            borderColor: '$colors.line.base' as const,
          }
        : {
            bg: 'transparent' as const,
            color: '$colors.fg.strong' as const,
            borderWidth: 0,
          };
  return (
    <Btn
      type="button"
      py="7px"
      px="12px"
      borderRadius="5px"
      fontFamily="$fontFamilies.sans"
      fontWeight={500}
      fontSize="12px"
      lineHeight={1}
      borderStyle="solid"
      cursor="pointer"
      {...styles}
    >
      {children}
    </Btn>
  );
}

function DemoBadge({ bg, color, children }: { bg: string; color: string; children: ReactNode }) {
  return (
    <Box
      as="span"
      display="inline-flex"
      gap={6}
      py={4}
      px={8}
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="10px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.08em"
      borderRadius="4px"
      bg={bg}
      color={color}
    >
      {children}
    </Box>
  );
}

function DemoTab({ active, children }: { active?: boolean; children: ReactNode }) {
  return (
    <Box
      as="span"
      py="6px"
      px="12px"
      fontFamily="$fontFamilies.sans"
      fontWeight={500}
      fontSize="11.5px"
      lineHeight={1}
      borderRadius="4px"
      cursor="pointer"
      bg={active ? '$colors.surface.paper' : 'transparent'}
      color={active ? '$colors.fg.strong' : '$colors.fg.muted'}
    >
      {children}
    </Box>
  );
}

function DemoAvatar({
  bg,
  color,
  stacked,
  children,
}: {
  bg: string;
  color: string;
  stacked?: boolean;
  children: ReactNode;
}) {
  return (
    <Box
      as="span"
      w={28}
      h={28}
      borderRadius="50%"
      borderStyle="solid"
      borderWidth={2}
      borderColor="$colors.surface.paper2"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      fontFamily="$fontFamilies.display"
      fontWeight={600}
      fontSize="10px"
      lineHeight={1}
      ml={stacked ? '-8px' : 0}
      bg={bg}
      color={color}
    >
      {children}
    </Box>
  );
}
