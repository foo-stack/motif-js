/**
 * The natural resting value for an animatable style/transform key — what the
 * element shows when no animation overlay is active.
 *
 * Enter animations interpolate *toward* this when the base style doesn't pin
 * the key; exit animations interpolate *from* it for exit-only keys. Most
 * numerics rest at 0 (`translateX`, offsets); `opacity` and the `scale`
 * family rest at 1; rotation/skew at `'0deg'`.
 *
 * Without this, an enter-only key (in `enterStyle` but absent from the base
 * style) was interpolated toward a blind 0 — so the canonical
 * `<Box enterStyle={{ opacity: 0 }} />` animated opacity 0 → 0 (invisible the
 * whole duration, then popped in) instead of 0 → 1.
 */
export function restingValueFor(key: string): string | number {
  switch (key) {
    case 'opacity':
    case 'scale':
    case 'scaleX':
    case 'scaleY': {
      return 1;
    }
    case 'rotate':
    case 'rotateX':
    case 'rotateY':
    case 'rotateZ':
    case 'skewX':
    case 'skewY': {
      return '0deg';
    }
    default: {
      return 0;
    }
  }
}
