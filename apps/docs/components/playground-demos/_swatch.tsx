import type { CSSProperties, ReactNode } from 'react';

const TONES: Record<string, string> = {
  a: '#C2410C',
  b: '#1D4ED8',
  c: '#15803D',
  d: '#7E22CE',
  e: '#A21CAF',
  f: '#0F766E',
};

export function Swatch({
  tone = 'a',
  size = 36,
  children,
  style,
}: {
  tone?: keyof typeof TONES | string;
  size?: number;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 6,
        background: TONES[tone] ?? tone,
        color: '#FBF7F2',
        fontFamily: 'var(--font-families-mono)',
        fontSize: 11,
        fontWeight: 500,
        lineHeight: 1,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function getTone(key: string): string {
  return TONES[key] ?? TONES.a!;
}
