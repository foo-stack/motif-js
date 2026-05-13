import { Box } from 'motif-js';
import { LandingSection, SectionHeadCenter, TitleEm } from './_LandingSection.js';

interface Quote {
  body: string;
  name: string;
  role: string;
  initials: string;
}

const quotes: readonly Quote[] = [
  {
    body: 'We replaced three styling libraries with motif-js and shipped our React Native app from the same codebase the next quarter. The hardest part was deleting code.',
    name: 'Beta tester quote',
    role: 'Placeholder until v1.2',
    initials: '··',
  },
  {
    body: 'The token system finally made our design system feel like a system instead of a Slack channel. Our designers can read the source.',
    name: 'Beta tester quote',
    role: 'Placeholder until v1.2',
    initials: '··',
  },
  {
    body: "Motif's variants are how I wish I had been writing styles for the last ten years. Compiles to nothing. Type-checks everything.",
    name: 'Beta tester quote',
    role: 'Placeholder until v1.2',
    initials: '··',
  },
];

const QUOTE_BODY_AXES = { opsz: 36, SOFT: 80 } as const;

export function Testimonials() {
  return (
    <LandingSection>
      <SectionHeadCenter
        eye="In their words (forthcoming)"
        title={
          <>
            Beta testers <TitleEm>are still landing</TitleEm>.
          </>
        }
        sub="The quotes below are illustrative — written by the team to mark out the outcomes we're designing toward. Real beta-tester quotes replace them at v1.2."
      />
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: 'repeat(3, 1fr)' }}
        gap={16}
      >
        {quotes.map((q) => (
          <Box
            as="figure"
            key={q.body.slice(0, 24)}
            m={0}
            borderStyle="solid"
            borderWidth={1}
            borderColor="$colors.line.faint"
            borderRadius="12px"
            p={28}
            bg="$colors.surface.paper2"
            display="flex"
            flexDirection="column"
            gap={24}
          >
            <Box
              as="blockquote"
              m={0}
              fontFamily="$fontFamilies.display"
              fontWeight={400}
              fontSize="18px"
              lineHeight={1.5}
              color="$colors.fg.strong"
              fontVariationSettings={QUOTE_BODY_AXES}
              style={{ fontStyle: 'italic', textWrap: 'pretty' }}
            >
              "{q.body}"
            </Box>
            <Box as="figcaption" display="flex" alignItems="center" gap={12} mt="auto">
              <Box
                as="span"
                w={36}
                h={36}
                borderRadius="50%"
                bg="$colors.surface.paper3"
                borderStyle="solid"
                borderWidth={1}
                borderColor="$colors.line.faint"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                fontFamily="$fontFamilies.display"
                fontWeight={600}
                fontSize="13px"
                lineHeight={1}
                color="$colors.fg.strong"
                flexShrink={0}
              >
                {q.initials}
              </Box>
              <Box>
                <Box
                  fontFamily="$fontFamilies.sans"
                  fontWeight={500}
                  fontSize="14px"
                  lineHeight={1.3}
                  color="$colors.fg.strong"
                >
                  {q.name}
                </Box>
                <Box
                  mt="2px"
                  fontFamily="$fontFamilies.sans"
                  fontWeight={400}
                  fontSize="12.5px"
                  lineHeight={1.3}
                  color="$colors.fg.faint"
                >
                  {q.role}
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </LandingSection>
  );
}
