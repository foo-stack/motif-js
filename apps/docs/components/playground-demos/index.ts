import type { ReactNode } from 'react';
import { heroDemo } from './hero.js';
import { boxDemo } from './box.js';
import { stackDemo } from './stack.js';
import { hstackDemo } from './hstack.js';
import { vstackDemo } from './vstack.js';
import { containerDemo } from './container.js';
import { centerDemo } from './center.js';
import { flexDemo } from './flex.js';
import { gridDemo } from './grid.js';
import { wrapDemo } from './wrap.js';
import { zstackDemo } from './zstack.js';
import { aspectRatioDemo } from './aspect-ratio.js';
import { spacerDemo } from './spacer.js';
import { safeAreaDemo } from './safe-area.js';
import { textDemo } from './text.js';
import { headingDemo } from './heading.js';
import { paragraphDemo } from './paragraph.js';
import { blockquoteDemo } from './blockquote.js';
import { codeDemo } from './code.js';
import { kbdDemo } from './kbd.js';
import { inputDemo } from './input.js';
import { textareaDemo } from './textarea.js';
import { numberInputDemo } from './number-input.js';
import { passwordInputDemo } from './password-input.js';
import { labelDemo } from './label.js';
import { fieldDemo } from './field.js';
import { fieldHelpDemo } from './field-help.js';
import { fieldErrorDemo } from './field-error.js';
import { fieldsetDemo } from './fieldset.js';
import { avatarDemo } from './avatar.js';
import { iconDemo } from './icon.js';
import { imageDemo } from './image.js';
import { svgDemo } from './svg.js';
import { linkDemo } from './link.js';

export type ControlValue = string | number | boolean;
export type ControlState = Readonly<Record<string, ControlValue>>;

export type ControlSpec =
  | { kind: 'color'; id: string; label: string; defaultValue: string }
  | {
      kind: 'range';
      id: string;
      label: string;
      defaultValue: number;
      min: number;
      max: number;
      step?: number;
    }
  | { kind: 'toggle'; id: string; label: string; defaultValue: boolean }
  | { kind: 'select'; id: string; label: string; defaultValue: string; options: readonly string[] };

export interface PlaygroundDemo {
  label: string;
  code: (state: ControlState) => string;
  preview: (state: ControlState) => ReactNode;
  controls?: readonly ControlSpec[];
}

export const playgroundDemos = {
  hero: heroDemo,
  box: boxDemo,
  stack: stackDemo,
  hstack: hstackDemo,
  vstack: vstackDemo,
  container: containerDemo,
  center: centerDemo,
  flex: flexDemo,
  grid: gridDemo,
  wrap: wrapDemo,
  zstack: zstackDemo,
  'aspect-ratio': aspectRatioDemo,
  spacer: spacerDemo,
  'safe-area': safeAreaDemo,
  text: textDemo,
  heading: headingDemo,
  paragraph: paragraphDemo,
  blockquote: blockquoteDemo,
  code: codeDemo,
  kbd: kbdDemo,
  input: inputDemo,
  textarea: textareaDemo,
  'number-input': numberInputDemo,
  'password-input': passwordInputDemo,
  label: labelDemo,
  field: fieldDemo,
  'field-help': fieldHelpDemo,
  'field-error': fieldErrorDemo,
  fieldset: fieldsetDemo,
  avatar: avatarDemo,
  icon: iconDemo,
  image: imageDemo,
  svg: svgDemo,
  link: linkDemo,
} satisfies Record<string, PlaygroundDemo>;

export type PlaygroundDemoName = keyof typeof playgroundDemos;
