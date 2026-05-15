import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { buttonStyle } from './_button.js';

const controls: readonly ControlSpec[] = [
  {
    kind: 'select',
    id: 'variant',
    label: 'variant',
    defaultValue: 'solid',
    options: ['solid', 'outline', 'ghost'],
  },
  {
    kind: 'select',
    id: 'size',
    label: 'size',
    defaultValue: 'md',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
];

const BOX: Record<string, number> = { xs: 24, sm: 28, md: 36, lg: 44, xl: 52 };

function code(state: ControlState): string {
  return `import { IconButton } from 'usemotif';

<IconButton
  aria-label="Edit"
  variant="${String(state.variant)}"
  size="${String(state.size)}"
>
  <path d="M4 20h4L18 10l-4-4L4 16z" />
</IconButton>`;
}

function preview(state: ControlState) {
  const px = BOX[String(state.size)] ?? 36;
  const base = buttonStyle(String(state.variant), 'primary', String(state.size));
  return (
    <button
      type="button"
      aria-label="Edit"
      style={{
        ...base,
        width: px,
        height: px,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <svg
        width={px * 0.5}
        height={px * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20h4L18 10l-4-4L4 16z" />
      </svg>
    </button>
  );
}

export const iconButtonDemo: PlaygroundDemo = {
  label: 'IconButton',
  code,
  preview,
  controls,
};
