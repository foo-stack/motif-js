import type { ReactNode } from 'react';

export interface EyebrowProps {
  children: ReactNode;
  dot?: boolean;
}

export function Eyebrow({ children, dot = true }: EyebrowProps) {
  return (
    <span className="eyebrow">
      {dot ? <span className="eyebrow__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
