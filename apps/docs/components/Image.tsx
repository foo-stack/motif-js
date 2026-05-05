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
    <figure className="figure">
      <div className="figure__media">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" />
      </div>
      {caption ? <figcaption className="figure__caption">{caption}</figcaption> : null}
    </figure>
  );
}
