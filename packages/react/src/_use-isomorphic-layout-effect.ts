'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server.
 *
 * The animation hooks live in `'use client'` modules, but those still render
 * to HTML during SSR / prerender / RSC - where React logs "useLayoutEffect
 * does nothing on the server" for every element. Selecting `useEffect` when
 * there is no DOM silences that warning while keeping synchronous,
 * pre-paint layout timing in the browser (where it matters for
 * flicker-free enter/exit animation).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
