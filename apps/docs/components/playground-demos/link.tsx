import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'underline',
    label: 'underline',
    defaultValue: 'hover',
    options: ['hover', 'always', 'never'],
  },
];

function code(state: ControlState): string {
  return `import { Link } from 'usemotif';

<Link href="/docs" underline="${String(state.underline)}">
  Read the docs
</Link>`;
}

function preview(state: ControlState) {
  const u = String(state.underline);
  return (
    <a
      href="#link-demo"
      onClick={(e) => e.preventDefault()}
      style={{
        fontFamily: 'var(--font-families-sans)',
        fontSize: 15,
        color: 'var(--colors-accent-base)',
        textDecoration: u === 'always' ? 'underline' : 'none',
        cursor: 'pointer',
      }}
    >
      Read the docs
    </a>
  );
}

export const linkDemo: PlaygroundDemo = { label: 'Link', code, preview, controls };
