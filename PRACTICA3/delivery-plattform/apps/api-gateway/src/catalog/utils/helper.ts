export type RequestWithUser = {
  user: { id: string; role: string; email: string; name?: string };
};

export function toBool(v: unknown, def = false): boolean {
  if (v === undefined || v === null) return def;
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

export function toInt(
  v: unknown,
  def: number,
  min: number,
  max: number,
): number {
  const n = Number.parseInt(String(v ?? ''), 10);
  const safe = Number.isFinite(n) ? n : def;
  return Math.min(Math.max(safe, min), max);
}
