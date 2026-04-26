import { Box, type BoxProps } from './Box.js';

export type TextProps = BoxProps;

/**
 * Text primitive. Renders a `<span>` by default with neutral typography
 * defaults; use the standard style props (`fontSize`, `fontWeight`,
 * `color`, `lineHeight`) to vary.
 *
 * For semantic block-level text, override `as` (`<Text as="p">`) or use
 * the `Heading` / `Paragraph` primitives once they ship.
 */
export function Text({ as = 'span', ...rest }: TextProps) {
  return <Box as={as} {...rest} />;
}
