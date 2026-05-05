import type { ReactNode } from 'react';

export interface LedeProps {
  children: ReactNode;
}

export function Lede({ children }: LedeProps) {
  return <p className="article__lede">{children}</p>;
}
