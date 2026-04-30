'use client';

import type { ReactNode } from 'react';
import { Box, HStack, Heading, Pressable, Text, VStack } from '@motif-js/react';
import { Dialog } from '@motif-js/headless';
import { RotateCcw, X } from '@motif-js/icons';
import type { ThemeMode } from '../../state/theme';
import type { BodyFont, ContentWidth, UseTweaksResult } from '../../state/tweaks';

export interface TweaksPanelProps {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  themeMode: ThemeMode;
  setThemeMode: (next: ThemeMode) => void;
  tweaks: UseTweaksResult;
}

export function TweaksPanel({
  open,
  onOpenChange,
  themeMode,
  setThemeMode,
  tweaks,
}: TweaksPanelProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          alignItems={{ base: 'flex-end', md: 'flex-start' }}
          justifyContent={{ base: 'stretch', md: 'flex-end' }}
          p={{ base: 0, md: '$4' }}
        >
          <Box
            width={{ base: '100%', md: 360 }}
            maxHeight={{ base: '85vh', md: 'calc(100vh - 32px)' }}
            bg="$colors.surface.raised"
            color="$colors.text.default"
            borderRadius={{ base: '$radii.lg', md: '$radii.lg' }}
            borderWidth={1}
            borderStyle="solid"
            borderColor="$colors.border.default"
            boxShadow="0 24px 48px -12px rgb(0 0 0 / 0.25), 0 8px 16px -8px rgb(0 0 0 / 0.15)"
            overflow="hidden"
            display="flex"
            flexDirection="column"
          >
            <HStack
              alignItems="center"
              justifyContent="space-between"
              px="$5"
              py="$4"
              borderBottomWidth={1}
              borderBottomStyle="solid"
              borderBottomColor="$colors.border.muted"
            >
              <Heading
                level={2}
                fontFamily="$fonts.sans"
                fontSize="$fontSizes.md"
                fontWeight="$fontWeights.semibold"
                color="$colors.text.strong"
              >
                Tweaks
              </Heading>
              <Dialog.Close>
                <CloseIcon />
              </Dialog.Close>
            </HStack>
            <Box flex={1} overflowY="auto" px="$5" py="$5">
              <VStack gap="$6" alignItems="stretch">
                <TweakRow label="Theme">
                  <SegmentedControl
                    value={themeMode}
                    options={[
                      { value: 'paper', label: 'Light' },
                      { value: 'ink', label: 'Dark' },
                    ]}
                    onChange={setThemeMode}
                  />
                </TweakRow>

                <TweakRow label="Content width">
                  <SegmentedControl<ContentWidth>
                    value={tweaks.state.contentWidth}
                    options={[
                      { value: 'narrow', label: 'Narrow' },
                      { value: 'standard', label: 'Standard' },
                      { value: 'wide', label: 'Wide' },
                    ]}
                    onChange={tweaks.setContentWidth}
                  />
                </TweakRow>

                <TweakRow label="Body font">
                  <SegmentedControl<BodyFont>
                    value={tweaks.state.bodyFont}
                    options={[
                      { value: 'sans', label: 'Inter' },
                      { value: 'serif', label: 'Fraunces' },
                    ]}
                    onChange={tweaks.setBodyFont}
                  />
                </TweakRow>

                <Pressable
                  as="button"
                  onPress={tweaks.reset}
                  display="inline-flex"
                  alignItems="center"
                  gap="$2"
                  alignSelf="flex-start"
                  px="$3"
                  py="$2"
                  borderRadius="$radii.md"
                  bg="transparent"
                  color="$colors.text.muted"
                  borderWidth={1}
                  borderStyle="solid"
                  borderColor="$colors.border.muted"
                  fontSize="$fontSizes.sm"
                  cursor="pointer"
                  _hover={{ color: '$colors.text.default', borderColor: '$colors.border.default' }}
                >
                  <Box display="inline-flex" fontSize={14} aria-hidden="true">
                    <RotateCcw />
                  </Box>
                  <Text as="span">Reset tweaks</Text>
                </Pressable>
              </VStack>
            </Box>
          </Box>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
}

function TweakRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <VStack gap="$2" alignItems="stretch">
      <Text
        as="span"
        fontFamily="$fonts.sans"
        fontSize="$fontSizes.2xs"
        fontWeight="$fontWeights.semibold"
        color="$colors.text.faint"
        textTransform="uppercase"
        letterSpacing="0.08em"
      >
        {label}
      </Text>
      {children}
    </VStack>
  );
}

interface SegmentedControlOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: ReadonlyArray<SegmentedControlOption<T>>;
  onChange: (next: T) => void;
}) {
  return (
    <HStack
      gap={0}
      borderWidth={1}
      borderStyle="solid"
      borderColor="$colors.border.muted"
      borderRadius="$radii.md"
      bg="$colors.surface.muted"
      p={2}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            as="button"
            onPress={() => onChange(opt.value)}
            flex={1}
            px="$2"
            py="$1"
            borderRadius="$radii.sm"
            borderWidth={0}
            bg={active ? '$colors.surface.raised' : 'transparent'}
            color={active ? '$colors.text.strong' : '$colors.text.muted'}
            fontFamily="$fonts.sans"
            fontSize="$fontSizes.sm"
            fontWeight={active ? '$fontWeights.semibold' : '$fontWeights.medium'}
            cursor="pointer"
            transition={{ property: 'background-color, color', duration: '$durations.ui' }}
            _hover={{ color: '$colors.text.default' }}
          >
            {opt.label}
          </Pressable>
        );
      })}
    </HStack>
  );
}

function CloseIcon() {
  return (
    <Box
      as="button"
      aria-label="Close tweaks"
      width={32}
      height={32}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="$radii.md"
      bg="transparent"
      color="$colors.text.muted"
      borderWidth={0}
      cursor="pointer"
      _hover={{ bg: '$colors.surface.muted', color: '$colors.text.default' }}
    >
      <Box display="inline-flex" fontSize={16}>
        <X aria-hidden="true" />
      </Box>
    </Box>
  );
}
