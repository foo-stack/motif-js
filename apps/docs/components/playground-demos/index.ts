import type { ReactNode } from 'react';
import { heroDemo } from './hero.js';

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
} satisfies Record<string, PlaygroundDemo>;

export type PlaygroundDemoName = keyof typeof playgroundDemos;
