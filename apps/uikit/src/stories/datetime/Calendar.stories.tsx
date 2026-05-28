import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { VStack } from 'usemotif';
import { Calendar } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';
import { CAL_GRID, CalendarStyles, dayCell } from './_calendar.js';

/**
 * Calendar — a self-building `role="grid"` month with full keyboard nav
 * (arrows move day-by-day, PageUp/Down change month, Home/End jump within
 * the week, Enter/Space select). It owns the 6×7 grid; `renderDay` styles
 * each cell from `{ date, isSelected, isToday, isOutsideMonth, isDisabled }`.
 * Selection is controlled (`value`/`onValueChange`) or uncontrolled
 * (`defaultValue`). `isDisabled(date)` blocks days; `weekStartsOn`
 * (0=Sun..6=Sat) sets the first column.
 *
 * Note: the headless grid ships its own 7-column layout; `CalendarStyles` only
 * adds cosmetic cell-centring + weekday-header styling (no per-header hook).
 */
const meta = {
  title: 'Date & Time/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  argTypes: {
    renderDay: { control: false },
    isDisabled: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    style: { control: false },
    weekStartsOn: { control: { type: 'inline-radio' }, options: [0, 1] },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Controlled selection — today preselected, status line below. */
export const Playground: Story = {
  render: () => {
    function Demo() {
      const [date, setDate] = useState<Date>(new Date());
      return (
        <VStack gap="$2">
          <CalendarStyles />
          <Calendar value={date} onValueChange={setDate} style={CAL_GRID} renderDay={dayCell} />
          <Note>selected = {date.toLocaleDateString()}</Note>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/** Week starts on Monday. */
export const MondayStart: Story = {
  render: () => {
    function Demo() {
      const [date, setDate] = useState<Date>(new Date());
      return (
        <>
          <CalendarStyles />
          <Calendar
            value={date}
            onValueChange={setDate}
            weekStartsOn={1}
            style={CAL_GRID}
            renderDay={dayCell}
          />
        </>
      );
    }
    return <Demo />;
  },
};

/** Weekends disabled via `isDisabled`. */
export const DisabledDays: Story = {
  render: () => {
    function Demo() {
      const [date, setDate] = useState<Date>(new Date());
      return (
        <>
          <CalendarStyles />
          <Calendar
            value={date}
            onValueChange={setDate}
            isDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
            style={CAL_GRID}
            renderDay={dayCell}
          />
        </>
      );
    }
    return <Demo />;
  },
};
