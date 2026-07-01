/** Node's DNS/net errors attach a `code` (e.g. "ENOTFOUND"); this narrows
 * an `unknown` catch value down to something we can safely read from. */
export function errorInfo(err: unknown): { code?: string; message: string } {
  if (err && typeof err === "object") {
    const e = err as { code?: unknown; message?: unknown };
    return {
      code: typeof e.code === "string" ? e.code : undefined,
      message: typeof e.message === "string" ? e.message : "Unknown error",
    };
  }
  return { message: String(err) };
}
