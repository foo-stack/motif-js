import type { CSSProperties } from 'react';

const INTENT: Record<string, { bg: string; fg: string }> = {
  primary: { bg: '#1D4ED8', fg: '#FBF7F2' },
  danger: { bg: '#B91C1C', fg: '#FBF7F2' },
  success: { bg: '#15803D', fg: '#FBF7F2' },
  neutral: { bg: '#E7E2DA', fg: '#1C1917' },
};

const PAD: Record<string, { px: number; py: number; fs: number }> = {
  xs: { px: 8, py: 4, fs: 12 },
  sm: { px: 12, py: 6, fs: 13 },
  md: { px: 16, py: 8, fs: 14 },
  lg: { px: 20, py: 10, fs: 16 },
  xl: { px: 24, py: 12, fs: 18 },
};

export function buttonStyle(variant: string, intent: string, size: string): CSSProperties {
  const t = INTENT[intent] ?? INTENT.primary!;
  const p = PAD[size] ?? PAD.md!;
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: p.py,
    paddingBottom: p.py,
    paddingLeft: p.px,
    paddingRight: p.px,
    fontFamily: 'var(--font-families-sans)',
    fontWeight: 600,
    fontSize: p.fs,
    lineHeight: 1,
    borderRadius: 8,
    border: '1px solid transparent',
    cursor: 'pointer',
  };
  if (variant === 'solid') {
    return { ...base, background: t.bg, color: t.fg, borderColor: t.bg };
  }
  if (variant === 'outline') {
    return { ...base, background: 'transparent', color: t.bg, borderColor: t.bg };
  }
  return { ...base, background: 'transparent', color: t.bg };
}

export { INTENT as buttonIntents };
