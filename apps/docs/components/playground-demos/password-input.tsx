import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';
import { inputBox } from './_field.js';

const controls: readonly ControlSpec[] = [
  { kind: 'toggle', id: 'visible', label: 'reveal', defaultValue: false },
];

function code(state: ControlState): string {
  return `import { PasswordInput } from 'usemotif';

<PasswordInput
  placeholder="Password"${state.visible ? '' : '\n  togglable'}
/>`;
}

function preview(state: ControlState) {
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type={state.visible ? 'text' : 'password'}
        defaultValue="correct horse"
        style={{ ...inputBox(), paddingRight: 40 }}
      />
      <span
        style={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 14,
        }}
      >
        {state.visible ? '🙈' : '👁'}
      </span>
    </span>
  );
}

export const passwordInputDemo: PlaygroundDemo = {
  label: 'PasswordInput',
  code,
  preview,
  controls,
};
