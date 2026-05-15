import type { PlaygroundDemo } from './index.js';
import { inputBox } from './_field.js';

function code(): string {
  return `import { NumberInput } from 'usemotif';

<NumberInput min={0} max={10} defaultValue={3} />`;
}

function preview() {
  return <input type="number" min={0} max={10} defaultValue={3} style={inputBox()} />;
}

export const numberInputDemo: PlaygroundDemo = {
  label: 'NumberInput',
  code,
  preview,
};
