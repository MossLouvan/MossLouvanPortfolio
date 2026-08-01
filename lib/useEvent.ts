"use client";

import { useCallback, useInsertionEffect, useRef } from "react";

/**
 * Returns a callback with a permanently stable identity that always calls the
 * latest version of `handler`.
 *
 * Use it for callbacks that an effect only *invokes* — event listeners, timers
 * — so the effect doesn't list them as dependencies and re-subscribe on every
 * parent render.
 *
 * This is the userland form of React's `useEffectEvent`; that hook exists in
 * React 19.2 but is not yet exported from the entry point bundlers resolve.
 * Swap this out once it is.
 */
export function useEvent<Args extends unknown[], R>(
  handler: (...args: Args) => R
): (...args: Args) => R {
  const ref = useRef(handler);

  // Written after commit, never during render (React may discard render work),
  // and before any layout/passive effect can call it. Deliberately has no
  // dependency array: the point is to refresh on every commit.
  useInsertionEffect(() => {
    ref.current = handler;
  });

  return useCallback((...args: Args) => ref.current(...args), []);
}
