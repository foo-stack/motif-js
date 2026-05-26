/**
 * Edge tokens accepted in a `useScroll({ target, offset })` pair.
 *
 * A {@link ScrollOffsetPair} encodes two edges per entry: the element
 * edge (`start | center | end | <number> | <percent>`) and the viewport
 * edge (same shape). The two coordinates align when progress reaches
 * the matching anchor (0 for the first pair, 1 for the second).
 *
 * Strings supported:
 *
 * - keyword form: `'start'` / `'center'` / `'end'` (case-insensitive)
 * - percentage: `'0%'`, `'50%'`, `'100%'` — any value
 * - plain fraction: `'0'`, `'0.5'`, `'1'` — parsed as 0..1
 *
 * Bare numeric values pass through as fractions.
 */
export type ScrollOffsetEdge = 'start' | 'center' | 'end' | string | number;

/**
 * One entry of a `useScroll` offset pair. Encodes the element-edge /
 * viewport-edge pair as a single space-separated string (framer-motion
 * compatible: `'start end'`, `'end start'`, …) or as a tuple. The tuple
 * form is useful when one or both edges are numeric.
 */
export type ScrollOffsetEntry = string | readonly [ScrollOffsetEdge, ScrollOffsetEdge];

/**
 * Two-entry pair defining the progress range:
 *
 * - First entry: progress = 0 alignment
 * - Second entry: progress = 1 alignment
 *
 * Default in `useScroll`: `['start end', 'end start']` — progress runs
 * `0 → 1` as the element's top enters the bottom of the viewport and
 * continues until the element's bottom exits the top of the viewport.
 */
export type ScrollOffsetPair = readonly [ScrollOffsetEntry, ScrollOffsetEntry];

/**
 * Resolved edge pair — each value is a fraction in `[0, 1]` of its
 * respective axis (element height for the element edge, viewport
 * height for the viewport edge). The progress computation in
 * `useScroll` consumes these.
 */
export interface ResolvedScrollOffsetEntry {
  /** Fraction along the element's axis (0 = start, 1 = end). */
  readonly elementFraction: number;
  /** Fraction along the viewport's axis (0 = start, 1 = end). */
  readonly viewportFraction: number;
}

/**
 * Parse a single edge token into a `0..1` fraction.
 *
 * Throws an Error in dev when the input is unrecognised — the caller
 * pre-validates these at hook setup, so a thrown error here means the
 * consumer passed something we don't understand and should know about.
 *
 * @internal — exported for tests; consumers go through
 * {@link parseScrollOffset}.
 */
export function parseScrollOffsetEdge(edge: ScrollOffsetEdge): number {
  if (typeof edge === 'number') return edge;
  const trimmed = edge.trim().toLowerCase();
  if (trimmed === 'start') return 0;
  if (trimmed === 'center') return 0.5;
  if (trimmed === 'end') return 1;
  if (trimmed.endsWith('%')) {
    const n = parseFloat(trimmed.slice(0, -1));
    if (Number.isFinite(n)) return n / 100;
  }
  const asNumber = parseFloat(trimmed);
  if (Number.isFinite(asNumber)) return asNumber;
  throw new Error(`[motif] unrecognised scroll offset edge: ${String(edge)}`);
}

function parseEntry(entry: ScrollOffsetEntry): ResolvedScrollOffsetEntry {
  if (typeof entry === 'string') {
    const parts = entry.trim().split(/\s+/);
    if (parts.length !== 2) {
      throw new Error(
        `[motif] scroll offset entries must be "<element-edge> <viewport-edge>"; got "${entry}"`,
      );
    }
    return {
      elementFraction: parseScrollOffsetEdge(parts[0]!),
      viewportFraction: parseScrollOffsetEdge(parts[1]!),
    };
  }
  return {
    elementFraction: parseScrollOffsetEdge(entry[0]),
    viewportFraction: parseScrollOffsetEdge(entry[1]),
  };
}

/**
 * Parse a {@link ScrollOffsetPair} into resolved fractions. The
 * `useScroll` hook calls this once at setup and again whenever the
 * `offset` reference changes (cheap to re-run — pure string parsing).
 *
 * @example
 *   parseScrollOffset(['start end', 'end start'])
 *   // → [{ elementFraction: 0, viewportFraction: 1 }, { elementFraction: 1, viewportFraction: 0 }]
 */
export function parseScrollOffset(
  offset: ScrollOffsetPair,
): readonly [ResolvedScrollOffsetEntry, ResolvedScrollOffsetEntry] {
  return [parseEntry(offset[0]), parseEntry(offset[1])];
}

/**
 * Compute the target-relative progress along an axis given the
 * element's position / size, the viewport's start / size, the current
 * scroll position, and the resolved offset entries.
 *
 * The math: as the consumer scrolls, the element's viewport-relative
 * edge values shift by the negative of the scroll delta. We compute
 * the signed "gap" between the element edge and the viewport edge for
 * each offset entry; progress walks from 0 (when entry-1 aligns) to 1
 * (when entry-2 aligns).
 *
 * @param elementStart — element's start coordinate **relative to the scroll
 *                       container's content origin** (e.g. `layoutY` on RN,
 *                       `rect.top + scrollY` on web).
 * @param elementSize — element's size along the axis.
 * @param viewportStart — viewport's start coordinate in the same
 *                        reference frame as `elementStart` (i.e. the
 *                        current scroll position).
 * @param viewportSize — viewport's size along the axis.
 * @param offsets — resolved offset entries (`parseScrollOffset` output).
 * @returns Progress clamped to `[0, 1]`.
 */
export function computeTargetScrollProgress(
  elementStart: number,
  elementSize: number,
  viewportStart: number,
  viewportSize: number,
  offsets: readonly [ResolvedScrollOffsetEntry, ResolvedScrollOffsetEntry],
): number {
  // Each pair (e_f, v_f) defines an anchor scroll position:
  //   scrollY_anchor = elementStart + elementSize*e_f - viewportSize*v_f
  // Progress is the lerp between the two anchors.
  const a0 = elementStart + elementSize * offsets[0].elementFraction - viewportSize * offsets[0].viewportFraction;
  const a1 = elementStart + elementSize * offsets[1].elementFraction - viewportSize * offsets[1].viewportFraction;
  const denom = a1 - a0;
  if (denom === 0) return 0;
  const t = (viewportStart - a0) / denom;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t;
}
