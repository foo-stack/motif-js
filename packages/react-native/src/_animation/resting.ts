/**
 * The natural resting value for an animatable style/transform key - what the
 * element shows when no animation overlay is active.
 *
 * Enter animations interpolate *toward* this when the base style doesn't pin
 * the key; exit animations interpolate *from* it for exit-only keys. Most
 * numerics rest at 0 (`translateX`, offsets); `opacity` and the `scale`
 * family rest at 1; rotation/skew at `'0deg'`.
 *
 * Without this, an enter-only key (in `enterStyle` but absent from the base
 * style) was interpolated toward a blind 0 - so the canonical
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

/**
 * The resting (identity) form of a React Native `transform` array, shaped like
 * `reference` so the driver can interpolate axis-by-axis. Each single-axis
 * entry (`{ translateX: -20 }`, `{ rotate: '45deg' }`) is replaced by its
 * identity (`{ translateX: 0 }`, `{ rotate: '0deg' }`).
 *
 * Without this, an enter/exit-only `transform` (composed from `enterStyle={{
 * x: -20 }}`) targeted the scalar `restingValueFor('transform')` → `0`, an
 * invalid value RN's `processTransform` rejects - so the slide never animated.
 */
export function restingTransformArray(reference: unknown): unknown {
  if (!Array.isArray(reference)) return restingValueFor('transform');
  return reference.map((entry) => {
    if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
      const axis = Object.keys(entry as Record<string, unknown>)[0];
      if (axis !== undefined) return { [axis]: restingValueFor(axis) };
    }
    return entry;
  });
}

/**
 * Build the entry-animation target for every key a motion bag (`from`)
 * declares. When the base style pins the key, animate toward that value;
 * otherwise animate toward the property's natural resting value - so an
 * enter-only key like `opacity` resolves to `1`, and a `transform` resolves to
 * a structurally-valid identity array rather than the blind scalar `0`.
 */
export function resolveEnterTargets(
  base: Record<string, string | number>,
  from: Record<string, string | number>,
): Record<string, string | number> {
  const out: Record<string, string | number> = {};
  for (const k of Object.keys(from)) {
    if (k in base) {
      out[k] = base[k]!;
    } else if (k === 'transform') {
      out[k] = restingTransformArray(from[k]) as string | number;
    } else {
      out[k] = restingValueFor(k);
    }
  }
  return out;
}
