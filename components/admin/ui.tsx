import Link from 'next/link';
import { AlertTriangle, CheckCircle2, CircleDashed, Clock, Database, MinusCircle, XCircle } from 'lucide-react';
import type { LeadStatus, OdooStatus } from '@/lib/leads';
import type { DbKind } from '@/lib/db';
import { cn } from '@/lib/utils';

export const adminLabel = 'text-[11px] font-bold uppercase tracking-[1px] text-muted';

export function Card({ title, action, className, children }: { title?: string; action?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn('rounded-[18px] border border-white/10 bg-surface p-5 md:p-6', className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && <h2 className="text-[15px] font-medium text-fg">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h1 className="font-display text-[26px] font-medium tracking-[-0.5px] text-fg md:text-[30px]">{title}</h1>
      {children}
    </div>
  );
}

// ─── Status badges (icon + label, never colour alone) ─────────────

const leadStatusStyle: Record<LeadStatus, string> = {
  new: 'border-accent-2/50 text-fg',
  contacted: 'border-white/25 text-fg',
  qualified: 'border-white/25 text-fg',
  won: 'border-emerald-400/50 text-emerald-300',
  lost: 'border-white/15 text-muted',
  spam: 'border-white/15 text-muted line-through',
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] capitalize', leadStatusStyle[status])}>
      {status === 'new' && <span className="h-1.5 w-1.5 rounded-full bg-accent-2" aria-hidden="true" />}
      {status}
    </span>
  );
}

const odooStyle: Record<OdooStatus, { cls: string; Icon: typeof CheckCircle2; label: string }> = {
  synced: { cls: 'text-emerald-300', Icon: CheckCircle2, label: 'In Odoo' },
  failed: { cls: 'text-red-300', Icon: XCircle, label: 'Sync failed' },
  pending: { cls: 'text-muted', Icon: Clock, label: 'Pending' },
  skipped: { cls: 'text-muted', Icon: MinusCircle, label: 'Not sent' },
};

export function OdooBadge({ status }: { status: OdooStatus }) {
  const { cls, Icon, label } = odooStyle[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap', cls)}>
      <Icon size={14} aria-hidden="true" />
      {label}
    </span>
  );
}

// ─── Database notice ──────────────────────────────────────────────

export function DbNotice({ kind }: { kind: DbKind | null }) {
  if (kind === 'neon') return null;
  return (
    <div className={cn('mb-6 flex gap-3 rounded-2xl border p-4 text-[14px]', kind ? 'border-white/12 bg-white/[0.03] text-muted' : 'border-accent-2/40 bg-accent-2/10 text-fg')}>
      {kind ? <Database size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> : <AlertTriangle size={18} className="mt-0.5 shrink-0 text-accent-2" aria-hidden="true" />}
      <p>
        {kind === 'pglite'
          ? 'Local development database (./.data/pglite). Set DATABASE_URL to use Neon Postgres.'
          : 'No database configured. Leads are only logged and sent to Odoo, and content edits can’t be saved. Add a Neon Postgres database in Vercel (it sets DATABASE_URL).'}
      </p>
    </div>
  );
}

// ─── KPI tile ─────────────────────────────────────────────────────

export function Kpi({ label, value, note, href }: { label: string; value: number | string; note?: React.ReactNode; href?: string }) {
  const body = (
    <>
      <p className={adminLabel}>{label}</p>
      <p className="font-display mt-2 text-[34px] leading-none font-semibold tracking-[-1px] text-fg">{value}</p>
      {note && <p className="mt-2 text-[13px] text-muted">{note}</p>}
    </>
  );
  const cls = 'block rounded-[18px] border border-white/10 bg-surface p-5';
  return href ? (
    <Link href={href} className={cn(cls, 'transition-colors hover:border-white/25')}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

// ─── Charts (single series → one hue, no legend; text in text tokens) ──

/** Daily bar chart with per-bar hover tooltip and a table fallback. */
export function DailyBars({ data, label }: { data: { day: string; n: number }[]; label: string }) {
  const max = Math.max(1, ...data.map(d => d.n));
  const ticks = niceTicks(max);
  const top = ticks[ticks.length - 1];
  const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

  return (
    <figure>
      <div className="relative flex h-[200px] gap-3">
        {/* y-axis */}
        <div className="flex w-6 flex-col-reverse justify-between text-end text-[11px] text-muted tabular-nums" aria-hidden="true">
          {ticks.map(t => (
            <span key={t} className="-my-1.5 leading-3">{t}</span>
          ))}
        </div>
        <div className="relative flex-1">
          {/* recessive grid */}
          <div className="absolute inset-0 flex flex-col-reverse justify-between" aria-hidden="true">
            {ticks.map(t => (
              <span key={t} className={cn('block h-px', t === 0 ? 'bg-white/25' : 'bg-white/[0.06]')} />
            ))}
          </div>
          <ol className="absolute inset-0 flex items-end gap-[2px]" aria-label={label}>
            {data.map(d => (
              <li key={d.day} className="group relative flex h-full flex-1 items-end">
                <span
                  className="block w-full rounded-t-[4px] bg-accent-2 transition-opacity group-hover:opacity-80"
                  style={{ height: d.n ? `${(d.n / top) * 100}%` : 0, minHeight: d.n ? 3 : 0 }}
                />
                <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-lg border border-white/15 bg-bg-deep px-2.5 py-1.5 text-[12px] whitespace-nowrap text-fg opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {fmt(d.day)} · <strong className="font-semibold">{d.n}</strong> lead{d.n === 1 ? '' : 's'}
                </span>
                <span className="sr-only">
                  {fmt(d.day)}: {d.n}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-2 flex justify-between ps-9 text-[11px] text-muted" aria-hidden="true">
        <span>{fmt(data[0].day)}</span>
        <span>{fmt(data[Math.floor(data.length / 2)].day)}</span>
        <span>Today</span>
      </div>
      <details className="mt-4 text-[13px] text-muted">
        <summary className="cursor-pointer select-none hover:text-fg">View as table</summary>
        <table className="mt-3 w-full max-w-xs text-start">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-1 text-start font-medium">Date</th>
              <th className="py-1 text-end font-medium">Leads</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.day} className="border-b border-white/5">
                <td className="py-1">{fmt(d.day)}</td>
                <td className="py-1 text-end tabular-nums text-fg">{d.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

function niceTicks(max: number): number[] {
  const step = max <= 4 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : max <= 50 ? 10 : Math.ceil(max / 5 / 10) * 10;
  const ticks = [];
  for (let t = 0; t <= max + step - 1; t += step) ticks.push(t);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + step);
  return ticks;
}

/** Ranked horizontal bars — label + value as text, bar shows proportion. */
export function RankedBars({ rows, format = s => s, empty = 'No data yet' }: { rows: { key: string; n: number }[]; format?: (k: string) => string; empty?: string }) {
  if (!rows.length) return <p className="text-[14px] text-muted">{empty}</p>;
  const max = Math.max(...rows.map(r => r.n));
  return (
    <ul className="flex flex-col gap-3">
      {rows.map(r => (
        <li key={r.key} title={`${format(r.key)}: ${r.n}`}>
          <div className="mb-1 flex justify-between gap-3 text-[13px]">
            <span className="truncate text-fg">{format(r.key)}</span>
            <span className="tabular-nums text-muted">{r.n}</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06]">
            <div className="h-2 rounded-full bg-accent-2" style={{ width: `${(r.n / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[18px] border border-dashed border-white/15 p-10 text-center text-[14px] text-muted">
      <CircleDashed size={28} aria-hidden="true" />
      {children}
    </div>
  );
}
