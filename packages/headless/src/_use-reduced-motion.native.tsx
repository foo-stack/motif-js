import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Native counterpart of the web `useReducedMotion` hook. Reads RN's
 * `AccessibilityInfo.isReduceMotionEnabled()` and subscribes to
 * `reduceMotionChanged` so the value tracks the OS setting live.
 *
 * See `_use-reduced-motion.ts` for the cross-platform contract.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduced(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
