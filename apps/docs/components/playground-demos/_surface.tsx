import type { CSSProperties, ReactNode } from 'react';

export function panel(style?: CSSProperties): CSSProperties {
  return {
    background: 'var(--colors-surface-paper)',
    border: '1px solid var(--colors-line-base)',
    borderRadius: 10,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    padding: 16,
    fontFamily: 'var(--font-families-sans)',
    ...style,
  };
}

export function triggerButton(label: string): ReactNode {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 14px',
        borderRadius: 7,
        border: '1px solid var(--colors-line-base)',
        background: 'var(--colors-surface-paper)',
        fontFamily: 'var(--font-families-sans)',
        fontWeight: 600,
        fontSize: 13,
        color: 'var(--colors-fg-default)',
      }}
    >
      {label}
    </span>
  );
}

export function primaryButton(label: string): ReactNode {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '7px 14px',
        borderRadius: 7,
        border: '1px solid transparent',
        background: '#1D4ED8',
        color: '#FBF7F2',
        fontFamily: 'var(--font-families-sans)',
        fontWeight: 600,
        fontSize: 13,
      }}
    >
      {label}
    </span>
  );
}

export function caption(text: string): ReactNode {
  return (
    <span
      style={{
        fontFamily: 'var(--font-families-mono)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--colors-fg-faint)',
      }}
    >
      {text}
    </span>
  );
}
