'use client';

import { Box } from 'motif-js';
import { useCallback, useState } from 'react';
import { ArrowRight, GitHub } from '../chrome/icons.js';
import { DocAnchorBtn, DocPressBtn } from './_DocBtn.js';
import { TitleEm } from './_LandingSection.js';
import { Check, Copy } from './icons.js';

const INSTALL_CMD = 'npm install @motif-js/react';

const H2_AXES = { opsz: 144, SOFT: 60 } as const;

export function FinalCTA() {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(INSTALL_CMD).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Box
      as="section"
      borderTopStyle="solid"
      borderTopWidth={1}
      borderTopColor="$colors.line.faint"
      py={96}
      textAlign="center"
      style={{
        background:
          'radial-gradient(ellipse at 50% 100%, color-mix(in oklab, var(--colors-accent-base) 12%, transparent), transparent 60%), var(--colors-surface-paper)',
      }}
    >
      <Box maxW={1280} mx="auto" px={32}>
        <Box
          as="h2"
          m={0}
          mb={24}
          fontFamily="$fontFamilies.display"
          fontWeight={500}
          fontSize={{ base: '48px', lg: '80px' }}
          lineHeight={0.98}
          letterSpacing="-0.035em"
          color="$colors.fg.strong"
          fontVariationSettings={H2_AXES}
          style={{ textWrap: 'balance' }}
        >
          Ready to <TitleEm>ship</TitleEm>?
        </Box>
        <Box
          as="p"
          maxW={520}
          mt={0}
          mb={36}
          mx="auto"
          fontFamily="$fontFamilies.sans"
          fontWeight={400}
          fontSize="19px"
          lineHeight={1.5}
          color="$colors.fg.muted"
          style={{ textWrap: 'pretty' }}
        >
          The introduction is a five-minute read. By the end, you'll have a styled component running
          on web and native, from the same source.
        </Box>
        <Box display="flex" gap={12} justifyContent="center" flexWrap="wrap">
          <DocAnchorBtn variant="primary" href="/getting-started/introduction">
            Start the tour <ArrowRight />
          </DocAnchorBtn>
          <DocPressBtn
            variant="copyInstall"
            onClick={onCopy}
            title={copied ? 'Copied' : 'Copy install command'}
            aria-label="Copy install command"
          >
            <Box as="span" color="$colors.fg.faint">
              $
            </Box>
            <Box as="span">{INSTALL_CMD}</Box>
            <Box
              as="span"
              display="inline-flex"
              alignItems="center"
              p={4}
              borderRadius="4px"
              color="$colors.fg.faint"
              ml={4}
            >
              {copied ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}
            </Box>
          </DocPressBtn>
          <DocAnchorBtn
            variant="ghost"
            href="https://github.com/foo-stack/motif-js"
            rel="noreferrer"
          >
            <GitHub /> Star on GitHub
          </DocAnchorBtn>
        </Box>
      </Box>
    </Box>
  );
}
