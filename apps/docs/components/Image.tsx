import { Box } from 'usemotif';
import type { ReactNode } from 'react';

export interface ImageProps {
  src: string;
  alt: string;
  caption?: ReactNode;
  width?: number;
  height?: number;
}

export function Image({ src, alt, caption, width, height }: ImageProps) {
  return (
    <Box as="figure" m={0} my={22}>
      <Box
        borderStyle="solid"
        borderWidth={1}
        borderColor="$colors.line.faint"
        borderRadius="6px"
        overflow="hidden"
        bg="$colors.surface.paper2"
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </Box>
      {caption ? (
        <Box
          as="figcaption"
          mt={8}
          textAlign="center"
          fontFamily="$fontFamilies.sans"
          fontWeight={400}
          fontSize="13px"
          lineHeight={1.5}
          color="$colors.fg.faint"
          style={{ fontStyle: 'italic' }}
        >
          {caption}
        </Box>
      ) : null}
    </Box>
  );
}
