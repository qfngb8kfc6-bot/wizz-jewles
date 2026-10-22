export type ActionResult<F extends string = string> =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Partial<Record<F, string>> };
