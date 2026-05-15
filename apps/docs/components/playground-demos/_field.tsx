import type { CSSProperties } from 'react';

export function inputBox(invalid = false): CSSProperties {
  return {
    width: 240,
    padding: '8px 12px',
    fontFamily: 'var(--font-families-sans)',
    fontSize: 14,
    borderRadius: 8,
    border: `1px solid ${invalid ? 'var(--colors-status-error)' : 'var(--colors-line-base)'}`,
    background: 'var(--colors-surface-paper)',
    color: 'var(--colors-fg-default)',
    outline: 'none',
  };
}

export function labelText(): CSSProperties {
  return {
    fontFamily: 'var(--font-families-sans)',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--colors-fg-strong)',
  };
}

export function helpText(tone: 'muted' | 'error' = 'muted'): CSSProperties {
  return {
    fontFamily: 'var(--font-families-sans)',
    fontSize: 12,
    color: tone === 'error' ? 'var(--colors-status-error)' : 'var(--colors-fg-muted)',
  };
}
