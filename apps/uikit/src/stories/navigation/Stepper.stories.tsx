import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { Stepper, type StepperStep } from '@usemotif/headless';

// Stepper renders an `ol` of steps and calls `renderStep` for each, passing
// the resolved `status` ('pending' | 'active' | 'complete' | 'error'),
// `index`, and `isLast`. `current` (a step id) forces that step 'active';
// otherwise each step's own `status` applies. `orientation` lays the list
// horizontally (default) or vertically.
const STEPS: StepperStep[] = [
  { id: 'cart', label: 'Cart', status: 'complete' },
  { id: 'address', label: 'Address', status: 'complete' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

function dotStyle(status: StepperStep['status']): CSSProperties {
  const bg =
    status === 'complete'
      ? 'var(--colors-action-success-bg, #16a34a)'
      : status === 'active'
        ? 'var(--colors-action-primary-bg, #3b82f6)'
        : status === 'error'
          ? 'var(--colors-action-danger-bg, #dc2626)'
          : 'var(--colors-surface-muted, #e5e7eb)';
  const fg =
    status === 'pending' || status === undefined
      ? 'var(--colors-text-muted, #6b7280)'
      : '#ffffff';
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 999,
    background: bg,
    color: fg,
    fontSize: 13,
    fontWeight: 700,
  };
}
const connector: CSSProperties = {
  width: 40,
  height: 2,
  margin: '0 8px',
  background: 'var(--colors-border-default, #e5e7eb)',
};
const labelStyle: CSSProperties = {
  marginLeft: 8,
  color: 'var(--colors-text-default, #111827)',
  fontWeight: 600,
};

/**
 * Stepper — renders an `ol`; `renderStep` draws each step from
 * `{ step, index, status, isLast }`. Status is one of
 * `pending | active | complete | error`; pass `current` (a step id) to mark
 * a step active regardless of its own `status`. `orientation` is
 * `horizontal` (default) or `vertical`.
 */
const meta = {
  title: 'Navigation/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    renderStep: { control: false },
    steps: { control: false },
    style: { control: false },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    current: { control: 'text' },
  },
  // Stepper requires `steps` + `renderStep`; every story supplies its own via
  // `render`, so these meta-level args are placeholders to satisfy the type.
  args: {
    steps: [],
    renderStep: () => <span />,
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

function renderStep({
  step,
  index,
  status,
  isLast,
}: {
  step: StepperStep;
  index: number;
  status: StepperStep['status'];
  isLast: boolean;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={dotStyle(status)}>{status === 'complete' ? '✓' : index + 1}</span>
      <span style={labelStyle}>{step.label}</span>
      {!isLast ? <span style={connector} aria-hidden="true" /> : null}
    </span>
  );
}

/** Horizontal — complete / active / upcoming via per-step status + `current`. */
export const Playground: Story = {
  render: () => (
    <Stepper
      steps={STEPS}
      current="payment"
      orientation="horizontal"
      renderStep={renderStep}
      style={{ alignItems: 'center' }}
    />
  ),
};

/** Vertical layout. */
export const Vertical: Story = {
  render: () => (
    <Stepper
      steps={STEPS}
      current="payment"
      orientation="vertical"
      renderStep={({ step, index, status }) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 0' }}>
          <span style={dotStyle(status)}>{status === 'complete' ? '✓' : index + 1}</span>
          <span style={labelStyle}>{step.label}</span>
        </span>
      )}
    />
  ),
};

/** An error state on one step. */
export const WithError: Story = {
  render: () => (
    <Stepper
      steps={[
        { id: 'cart', label: 'Cart', status: 'complete' },
        { id: 'payment', label: 'Payment', status: 'error' },
        { id: 'review', label: 'Review' },
      ]}
      orientation="horizontal"
      renderStep={({ step, index, status, isLast }) => (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span style={dotStyle(status)}>
            {status === 'complete' ? '✓' : status === 'error' ? '!' : index + 1}
          </span>
          <span style={labelStyle}>{step.label}</span>
          {!isLast ? <span style={connector} aria-hidden="true" /> : null}
        </span>
      )}
      style={{ alignItems: 'center' }}
    />
  ),
};
