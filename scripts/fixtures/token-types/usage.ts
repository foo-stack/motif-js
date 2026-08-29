import type { BoxProps } from 'usemotif';
import './augmentation.js';

/** The type the probe reads. `p` is bound to the `space` scale. */
export type PaddingValue = Exclude<BoxProps['p'], undefined>;

/** A prop bound to a different scale, so the probe can prove they differ. */
export type BackgroundValue = Exclude<BoxProps['backgroundColor'], undefined>;

/** Raw CSS values must keep compiling. The probe fails if this ever errors. */
export const raw: PaddingValue = '12px';
export const numeric: PaddingValue = 12;
export const token: PaddingValue = '$space.4';

/**
 * The pseudo-state bag. Same prop shape, and the same collapse risk, so the
 * probe reads it too.
 */
export type HoverPaddingValue = Exclude<Exclude<BoxProps['_hover'], undefined>['p'], undefined>;
