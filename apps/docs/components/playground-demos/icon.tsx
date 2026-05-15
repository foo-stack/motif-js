import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'size',
    label: 'size',
    defaultValue: 'md',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  { kind: 'color', id: 'color', label: 'color', defaultValue: '#1D4ED8' },
];

const SIZE: Record<string, number> = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 };

function code(state: ControlState): string {
  return `import { Icon } from 'usemotif';

<Icon size="${String(state.size)}" aria-label="Add">
  <path d="M12 5v14M5 12h14" />
</Icon>`;
}

function preview(state: ControlState) {
  const px = SIZE[String(state.size)] ?? 20;
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke={String(state.color)}
      strokeWidth={2}
      strokeLinecap="round"
      role="img"
      aria-label="Add"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export const iconDemo: PlaygroundDemo = { label: 'Icon', code, preview, controls };
