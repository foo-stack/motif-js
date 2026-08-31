import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { inputBox } from './_field.js';

const controls: readonly ControlSpec[] = [
  { kind: 'range', id: 'rows', label: 'rows', defaultValue: 3, min: 2, max: 6 },
];

function code(state: ControlState): string {
  return `import { TextArea } from 'usemotif';

<TextArea
  rows={${Number(state.rows)}}
  placeholder="Leave a note..."
/>`;
}

function preview(state: ControlState) {
  return (
    <textarea
      rows={Number(state.rows)}
      placeholder="Leave a note..."
      style={{ ...inputBox(), resize: 'vertical' }}
    />
  );
}

export const textareaDemo: PlaygroundDemo = { label: 'TextArea', code, preview, controls };
