import type { CSSProperties, ReactElement } from 'react';

// Shared calendar styling for the Calendar + DatePicker stories. Not a story
// file (leading underscore, `.tsx` but no Meta export).
//
// The headless Calendar now ships its own row/cell grid layout, so these
// rules are purely cosmetic: they centre each cell's content and style the
// weekday headers - neither of which the component exposes a per-element hook
// for (only `renderDay` covers gridcell content; rows/headers have none). We
// scope to `[role="grid"]` (the Calendar is the only grid in the kit, and the
// DatePicker's calendar is portaled - a global-ish selector reaches it too).

export const CAL_GRID: CSSProperties = {
  display: 'inline-block',
  padding: 12,
  borderRadius: 12,
  border: '1px solid var(--colors-border-default, #e5e7eb)',
  background: 'var(--colors-surface-base, #ffffff)',
  outline: 'none',
};

const CAL_CSS = `
[role="grid"] [role="gridcell"],
[role="grid"] [role="columnheader"] {
  display: flex;
  align-items: center;
  justify-content: center;
}
[role="grid"] [role="columnheader"] {
  height: 26px;
  font-size: 11px;
  font-weight: 600;
  color: var(--colors-text-muted, #9ca3af);
}
`;

/** Injects the cosmetic cell-centring + header rules. Render once anywhere the
 *  Calendar (inline or portaled via DatePicker) appears. */
export function CalendarStyles(): ReactElement {
  return <style>{CAL_CSS}</style>;
}

export interface DayInfo {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isOutsideMonth: boolean;
  isDisabled: boolean;
}

/** Shared `renderDay` - a 30×30 cell centered inside the 36px grid column. */
export function dayCell({
  date,
  isSelected,
  isToday,
  isOutsideMonth,
  isDisabled,
}: DayInfo): ReactElement {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 8,
        fontSize: 13,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        background: isSelected ? 'var(--colors-action-primary-bg, #3b82f6)' : 'transparent',
        color: isSelected
          ? 'var(--colors-action-primary-fg, #ffffff)'
          : isOutsideMonth
            ? 'var(--colors-text-muted, #9ca3af)'
            : 'var(--colors-text-default, #111827)',
        opacity: isDisabled ? 0.35 : 1,
        outline:
          isToday && !isSelected ? '1px solid var(--colors-action-primary-bg, #3b82f6)' : 'none',
      }}
    >
      {date.getDate()}
    </span>
  );
}
