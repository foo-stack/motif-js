import { Box, Text } from 'usemotif';
import { Fragment, type ReactNode } from 'react';

/**
 * One axis of a matrix: a prop name plus the values to sweep across it.
 * `label` formats a value for the row/column header (defaults to `String`).
 */
export interface Axis<P, K extends keyof P = keyof P> {
  prop: K;
  values: ReadonlyArray<P[K]>;
  label?: (value: P[K]) => string;
}

export interface MatrixProps<P> {
  /** Renders one cell from the merged props (base + row value + col value). */
  render: (props: Partial<P>) => ReactNode;
  /** Swept down the rows. Omit for a single-row matrix. */
  rows?: Axis<P>;
  /** Swept across the columns. Omit for a single-column matrix. */
  cols?: Axis<P>;
  /** Constant props applied to every cell. */
  base?: Partial<P>;
}

const HEADER = '$colors.text.muted';

function header(text: string) {
  return (
    <Text fontSize="$xs" fontFamily="$mono" color={HEADER} mb={0} mt={0}>
      {text}
    </Text>
  );
}

/**
 * Renders a labelled grid of a component across one or two prop axes — the
 * backbone of the UIKit's exhaustive coverage. Rows and columns are each
 * optional, so the same helper drives a 1×N strip or an M×N grid.
 *
 *   <Matrix<ButtonProps>
 *     render={(p) => <Button {...p}>Label</Button>}
 *     rows={{ prop: 'variant', values: ['solid', 'outline', 'ghost'] }}
 *     cols={{ prop: 'intent', values: ['primary', 'danger', 'success'] }}
 *   />
 */
export function Matrix<P>({ render, rows, cols, base }: MatrixProps<P>) {
  const rowValues: readonly unknown[] = rows ? (rows.values as readonly unknown[]) : [undefined];
  const colValues: readonly unknown[] = cols ? (cols.values as readonly unknown[]) : [undefined];
  const fmtRow = (v: unknown) => (rows?.label ? rows.label(v as P[keyof P]) : String(v));
  const fmtCol = (v: unknown) => (cols?.label ? cols.label(v as P[keyof P]) : String(v));

  const hasRowHeader = Boolean(rows);
  const templateColumns = `${hasRowHeader ? 'auto ' : ''}repeat(${colValues.length}, max-content)`;

  return (
    <Box
      display="grid"
      gap="$4"
      alignItems="center"
      justifyItems="start"
      style={{ gridTemplateColumns: templateColumns }}
    >
      {/* Column header row */}
      {cols ? (
        <>
          {hasRowHeader ? <Box /> : null}
          {colValues.map((cv, i) => (
            <Box key={`col-${i}`}>{header(fmtCol(cv))}</Box>
          ))}
        </>
      ) : null}

      {/* Body */}
      {rowValues.map((rv, ri) => (
        <Fragment key={`row-${ri}`}>
          {hasRowHeader ? <Box pr="$3">{header(fmtRow(rv))}</Box> : null}
          {colValues.map((cv, ci) => {
            const cellProps = {
              ...base,
              ...(rows ? { [rows.prop]: rv } : {}),
              ...(cols ? { [cols.prop]: cv } : {}),
            } as Partial<P>;
            return <Box key={`cell-${ri}-${ci}`}>{render(cellProps)}</Box>;
          })}
        </Fragment>
      ))}
    </Box>
  );
}
