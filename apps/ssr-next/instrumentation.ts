/**
 * Next.js calls `register()` once on the server at app startup. We use it
 * to install motif's AsyncLocalStorage-backed collector storage so
 * concurrent renders (streaming SSR / RSC) don't clobber each other's
 * style collectors.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('@usemotif/react/server');
  }
}
