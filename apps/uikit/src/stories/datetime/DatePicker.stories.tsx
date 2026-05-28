import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { VStack } from 'usemotif';
import { DatePicker } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';
import { CalendarStyles, dayCell } from './_calendar.js';

// DatePicker is a Popover wrapped around Calendar. It owns the open state;
// `renderTrigger({ label, onClick })` draws the trigger (label is the
// formatted value or `placeholder`). It forwards Calendar props
// (value/defaultValue/onValueChange/locale/isDisabled/weekStartsOn) and
// closes the popover on selection. `popoverStyle` styles the panel.
//
// The calendar lives in a portal; `CalendarStyles` (a `[role="grid"]`-scoped
// rule) adds cosmetic cell-centring + header styling to the portaled month
// (the grid layout itself now ships with the headless Calendar).
const TRIGGER: CSSProperties = {
  appearance: 'none',
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid var(--colors-border-default, #e5e7eb)',
  background: 'var(--colors-surface-base, #ffffff)',
  color: 'var(--colors-text-default, #111827)',
  cursor: 'pointer',
  minWidth: 180,
  textAlign: 'left',
};
const POPOVER: CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: '1px solid var(--colors-border-default, #e5e7eb)',
  background: 'var(--colors-surface-base, #ffffff)',
  boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
};

/**
 * DatePicker — a Popover composed around `Calendar`. It owns the open
 * state; `renderTrigger({ label, onClick })` draws the trigger (where
 * `label` is the formatted value or `placeholder`). It forwards the
 * Calendar props (`value`/`defaultValue`/`onValueChange`/`locale`/
 * `isDisabled`/`weekStartsOn`/`renderDay`) and closes on selection.
 * `popoverStyle`/`triggerStyle` style the panel and default trigger.
 */
const meta = {
  title: 'Date & Time/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  argTypes: {
    renderTrigger: { control: false },
    renderDay: { control: false },
    isDisabled: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    onValueChange: { control: false },
    popoverStyle: { control: false },
    triggerStyle: { control: false },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled value with a custom trigger; opens a styled calendar popover. */
export const Playground: Story = {
  render: () => {
    function Demo() {
      const [date, setDate] = useState<Date | undefined>(undefined);
      return (
        <VStack gap="$2">
          <CalendarStyles />
          <DatePicker
            {...(date !== undefined ? { value: date } : {})}
            onValueChange={setDate}
            placeholder="Pick a date"
            popoverStyle={POPOVER}
            renderDay={dayCell}
            renderTrigger={({ label, onClick }) => (
              <button type="button" onClick={onClick} style={TRIGGER} aria-label="Choose date">
                {label}
              </button>
            )}
          />
          <Note>selected = {date ? date.toLocaleDateString() : '(none)'}</Note>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/** Default trigger (no `renderTrigger`) using `triggerStyle`. */
export const DefaultTrigger: Story = {
  render: () => {
    function Demo() {
      const [date, setDate] = useState<Date | undefined>(new Date());
      return (
        <>
          <CalendarStyles />
          <DatePicker
            {...(date !== undefined ? { value: date } : {})}
            onValueChange={setDate}
            triggerStyle={TRIGGER}
            popoverStyle={POPOVER}
            renderDay={dayCell}
          />
        </>
      );
    }
    return <Demo />;
  },
};
