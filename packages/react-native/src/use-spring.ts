import {
  createMotionValue,
  motionValueBrand,
  resolveAnimationToken,
  type MotionValue,
} from '@usemotif/core';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from './theme-context.js';

// Duplicate of `packages/react/src/use-spring.ts`. Both platform
// packages own their own copy of this hook so each one ships a
// complete motion-value surface without reaching into a sibling. The
// integrator body is React-only and has no DOM / RN-specific code;
// the two copies stay in sync by convention — change one, change the
// other.
//
// Native acceleration via a `useSpringBacking` driver method
// (Reanimated `withSpring`, Animated.spring on the default driver) is
// out of scope for v1 — the JS-thread integrator here runs through
// the same motion-value subscription channel as `useMotionValue` and
// is fast enough for typical UI springs. Driver acceleration is a
// separate follow-up.

/**
 * Spring physics configuration. Defaults match a critically-damped
 * UI spring (`stiffness=100, damping=10, mass=1`).
 */
export interface SpringConfig {
  /** Spring stiffness. Higher = faster snap. Default `100`. */
  stiffness?: number;
  /** Damping coefficient. Higher = less oscillation. Default `10`. */
  damping?: number;
  /** Mass of the spring. Higher = slower. Default `1`. */
  mass?: number;
  /** Settle threshold for velocity. Default `0.01`. */
  restSpeed?: number;
  /** Settle threshold for distance to target. Default `0.01`. */
  restDistance?: number;
  /** Initial velocity to seed on the first `.set()`. Default `0`. */
  velocity?: number;
}

interface ResolvedSpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  restSpeed: number;
  restDistance: number;
  velocity: number;
}

const DEFAULT_CONFIG: ResolvedSpringConfig = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  restSpeed: 0.01,
  restDistance: 0.01,
  velocity: 0,
};

function stripTokenPrefix(name: string): string {
  return name.startsWith('$animations.') ? name.slice('$animations.'.length) : name;
}

function resolveSpringInputs(
  config: SpringConfig | string | undefined,
  theme: { tokens: { animations?: Readonly<Record<string, unknown>> } } | undefined,
): ResolvedSpringConfig {
  if (config === undefined) return DEFAULT_CONFIG;

  if (typeof config === 'string') {
    const token = resolveAnimationToken(
      stripTokenPrefix(config),
      theme as Parameters<typeof resolveAnimationToken>[1],
    );
    if (token === undefined || token.type !== 'spring') return DEFAULT_CONFIG;
    return {
      stiffness: token.stiffness ?? DEFAULT_CONFIG.stiffness,
      damping: token.damping ?? DEFAULT_CONFIG.damping,
      mass: token.mass ?? DEFAULT_CONFIG.mass,
      restSpeed: DEFAULT_CONFIG.restSpeed,
      restDistance: DEFAULT_CONFIG.restDistance,
      velocity: DEFAULT_CONFIG.velocity,
    };
  }

  return {
    stiffness: config.stiffness ?? DEFAULT_CONFIG.stiffness,
    damping: config.damping ?? DEFAULT_CONFIG.damping,
    mass: config.mass ?? DEFAULT_CONFIG.mass,
    restSpeed: config.restSpeed ?? DEFAULT_CONFIG.restSpeed,
    restDistance: config.restDistance ?? DEFAULT_CONFIG.restDistance,
    velocity: config.velocity ?? DEFAULT_CONFIG.velocity,
  };
}

const MAX_DELTA_TIME_S = 0.064;

/**
 * A motion value whose `.set(target)` springs from the current value
 * toward `target` over the spring's natural duration, instead of
 * snapping. The returned value is a {@link MotionValue}, so it drops
 * into every styled-primitive prop that accepts a motion value —
 * `<Box opacity={spring} />`, `useTransform(spring, ...)`, etc.
 *
 * Config is either a literal {@link SpringConfig} or a theme token
 * name (`'bouncy'` or `'$animations.bouncy'`). Timing tokens (non-
 * spring) and unknown names fall back to the default spring.
 *
 * @example
 * ```tsx
 * const x = useSpring(0, { stiffness: 200, damping: 18 });
 * x.set(100);
 * ```
 *
 * @remarks
 * The spring runs a JS-thread `requestAnimationFrame` loop. Driver
 * acceleration (Reanimated `withSpring` / `Animated.spring`) is a
 * separate follow-up; for now the JS integrator goes through the same
 * subscription channel as `useMotionValue` and is fast enough for
 * typical UI springs.
 *
 * Honour user reduced-motion preference at the consumer level —
 * branch on RN's `AccessibilityInfo.isReduceMotionEnabled()` (or the
 * `useReducedMotion` hook from `@usemotif/headless`) and bypass
 * `useSpring` for an instant write when reduced motion is on.
 */
export function useSpring(initial: number, config?: SpringConfig | string): MotionValue<number> {
  const theme = useTheme();

  const configRef = useRef<ResolvedSpringConfig>(DEFAULT_CONFIG);
  configRef.current = resolveSpringInputs(config, theme as never);

  const stateRef = useRef<{
    target: number;
    velocity: number;
    rafId: number | null;
    lastTime: number;
  }>({
    target: initial,
    velocity: 0,
    rafId: null,
    lastTime: 0,
  });

  const [mv] = useState<MotionValue<number>>(() => {
    const inner = createMotionValue(initial);

    function step(now: number): void {
      const s = stateRef.current;
      const cfg = configRef.current;
      const dt = Math.min((now - s.lastTime) / 1000, MAX_DELTA_TIME_S);
      s.lastTime = now;

      let value = inner.get();
      const force = -cfg.stiffness * (value - s.target) - cfg.damping * s.velocity;
      s.velocity += (force / cfg.mass) * dt;
      value += s.velocity * dt;

      if (Math.abs(s.velocity) < cfg.restSpeed && Math.abs(value - s.target) < cfg.restDistance) {
        s.velocity = 0;
        s.rafId = null;
        inner.set(s.target);
        return;
      }

      inner.set(value);
      s.rafId = requestAnimationFrame(step);
    }

    return {
      [motionValueBrand]: true,
      get: () => inner.get(),
      on: inner.on,
      set(target: number): void {
        const s = stateRef.current;
        if (Object.is(s.target, target) && s.rafId === null && Object.is(inner.get(), target)) {
          return;
        }
        s.target = target;
        if (s.rafId === null) {
          if (s.velocity === 0) s.velocity = configRef.current.velocity;
          s.lastTime =
            typeof performance !== 'undefined' && typeof performance.now === 'function'
              ? performance.now()
              : Date.now();
          s.rafId = requestAnimationFrame(step);
        }
      },
    };
  });

  useEffect(
    () => () => {
      const s = stateRef.current;
      if (s.rafId !== null) {
        cancelAnimationFrame(s.rafId);
        s.rafId = null;
      }
    },
    [],
  );

  return mv;
}
