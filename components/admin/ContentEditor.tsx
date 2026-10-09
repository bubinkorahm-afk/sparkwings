'use client';

import { useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { saveContent } from '@/app/admin/actions';
import type { SiteContent } from '@/lib/content';
import { statKeys, type StatKey } from '@/content/home';
import { Card, adminLabel } from './ui';
import { cn } from '@/lib/utils';

const statLabels: Record<StatKey, string> = {
  years: 'Years in business',
  projects: 'Projects delivered',
  apps: 'Odoo apps deployed',
  countries: 'Countries served',
};

const input = 'min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.04] px-3 text-[14px] text-fg focus:border-accent-2 focus:outline-none';
const newId = () => Math.random().toString(36).slice(2, 10);

export function ContentEditor({ initial, canSave }: { initial: SiteContent; canSave: boolean }) {
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = JSON.stringify(content) !== JSON.stringify(saved);

  const patch = (fn: (draft: SiteContent) => void) =>
    setContent(prev => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  const move = <T,>(list: T[], i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
  };

  const onSave = () =>
    start(async () => {
      const res = await saveContent(JSON.stringify(content));
      if (res.ok) {
        setSaved(content);
        setResult({ ok: true, message: 'Saved. The live site shows the change on the next visit.' });
      } else {
        setResult({ ok: false, message: res.error });
      }
    });

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* ── Stats ── */}
      <Card title="Homepage stats">
        <p className="mb-5 text-[14px] text-muted">Leave a number blank to show the “[X]” placeholder. Only enter figures you can stand behind.</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statKeys.map(key => (
            <label key={key}>
              <span className={`${adminLabel} mb-1 block`}>{statLabels[key]}</span>
              <input
                type="number"
                min={0}
                max={100000}
                inputMode="numeric"
                value={content.stats[key] ?? ''}
                placeholder="[X]"
                onChange={e => patch(d => void (d.stats[key] = e.target.value === '' ? null : Math.max(0, Math.floor(Number(e.target.value)))))}
                className={input}
              />
            </label>
          ))}
        </div>
      </Card>

      {/* ── Testimonials ── */}
      <Card
        title="Testimonials"
        action={
          <button
            type="button"
            onClick={() => patch(d => void d.testimonials.push({ id: newId(), quote: { en: '', ar: '' }, name: '', company: { en: '', ar: '' }, published: false }))}
            disabled={content.testimonials.length >= 12}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 px-3.5 text-[13px] text-fg hover:border-white/50 disabled:opacity-40"
          >
            <Plus size={15} aria-hidden="true" /> Add
          </button>
        }
      >
        <p className="mb-5 text-[14px] text-muted">
          Only publish quotes the client has approved in writing. Until at least one is published, the homepage shows placeholder cards.
        </p>
        {content.testimonials.length === 0 && <p className="text-[14px] text-muted">No testimonials yet.</p>}
        <ol className="flex flex-col gap-4">
          {content.testimonials.map((t, i) => (
            <li key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="flex min-h-10 cursor-pointer items-center gap-2 text-[14px] text-fg">
                  <input
                    type="checkbox"
                    checked={t.published}
                    onChange={e => patch(d => void (d.testimonials[i].published = e.target.checked))}
                    className="h-4 w-4 accent-[var(--accent-2)]"
                  />
                  Published
                </label>
                <RowTools
                  label={`testimonial ${i + 1}`}
                  onUp={() => patch(d => move(d.testimonials, i, -1))}
                  onDown={() => patch(d => move(d.testimonials, i, 1))}
                  onRemove={() => patch(d => void d.testimonials.splice(i, 1))}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Quote (English)">
                  <textarea rows={3} maxLength={600} value={t.quote.en} onChange={e => patch(d => void (d.testimonials[i].quote.en = e.target.value))} className={cn(input, 'py-2')} />
                </Field>
                <Field label="Quote (Arabic)">
                  <textarea dir="rtl" rows={3} maxLength={600} value={t.quote.ar} onChange={e => patch(d => void (d.testimonials[i].quote.ar = e.target.value))} className={cn(input, 'py-2')} />
                </Field>
                <Field label="Name">
                  <input maxLength={120} value={t.name} onChange={e => patch(d => void (d.testimonials[i].name = e.target.value))} className={input} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Company (EN)">
                    <input maxLength={600} value={t.company.en} onChange={e => patch(d => void (d.testimonials[i].company.en = e.target.value))} className={input} />
                  </Field>
                  <Field label="Company (AR)">
                    <input dir="rtl" maxLength={600} value={t.company.ar} onChange={e => patch(d => void (d.testimonials[i].company.ar = e.target.value))} className={input} />
                  </Field>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* ── Clients ── */}
      <Card
        title="Clients"
        action={
          <button
            type="button"
            onClick={() =>
              patch(d => void d.clients.push({ id: newId(), name: '', url: '', description: { en: '', ar: '' }, country: { en: '', ar: '' } }))
            }
            disabled={content.clients.length >= 24}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 px-3.5 text-[13px] text-fg hover:border-white/50 disabled:opacity-40"
          >
            <Plus size={15} aria-hidden="true" /> Add
          </button>
        }
      >
        <p className="mb-5 text-[14px] text-muted">
          Shown as cards under “Our Happy Customers”, linking to the client’s website. Only list clients who are happy to be named.
        </p>
        <ol className="flex flex-col gap-4">
          {content.clients.map((c, i) => (
            <li key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[14px] font-medium text-fg">{c.name || `Client ${i + 1}`}</p>
                <RowTools
                  label={`client ${i + 1}`}
                  onUp={() => patch(d => move(d.clients, i, -1))}
                  onDown={() => patch(d => move(d.clients, i, 1))}
                  onRemove={() => patch(d => void d.clients.splice(i, 1))}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Name">
                  <input maxLength={120} value={c.name} onChange={e => patch(d => void (d.clients[i].name = e.target.value))} className={input} />
                </Field>
                <Field label="Website (https://…)">
                  <input type="url" maxLength={300} value={c.url} onChange={e => patch(d => void (d.clients[i].url = e.target.value.trim()))} className={input} />
                </Field>
                <Field label="What they do (English)">
                  <textarea rows={2} maxLength={600} value={c.description.en} onChange={e => patch(d => void (d.clients[i].description.en = e.target.value))} className={cn(input, 'py-2')} />
                </Field>
                <Field label="What they do (Arabic)">
                  <textarea dir="rtl" rows={2} maxLength={600} value={c.description.ar} onChange={e => patch(d => void (d.clients[i].description.ar = e.target.value))} className={cn(input, 'py-2')} />
                </Field>
                <Field label="Location (English)">
                  <input maxLength={600} value={c.country.en} onChange={e => patch(d => void (d.clients[i].country.en = e.target.value))} className={input} />
                </Field>
                <Field label="Location (Arabic)">
                  <input dir="rtl" maxLength={600} value={c.country.ar} onChange={e => patch(d => void (d.clients[i].country.ar = e.target.value))} className={input} />
                </Field>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* ── Past projects ── */}
      <Card
        title="Past projects"
        action={
          <button
            type="button"
            onClick={() => patch(d => void d.pastProjects.push({ id: newId(), slug: '', label: { en: '', ar: '' } }))}
            disabled={content.pastProjects.length >= 20}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-white/25 px-3.5 text-[13px] text-fg hover:border-white/50 disabled:opacity-40"
          >
            <Plus size={15} aria-hidden="true" /> Add
          </button>
        }
      >
        <p className="mb-5 text-[14px] text-muted">Shown as pills under the testimonials. Each links to /work/&lt;slug&gt; (lowercase letters, numbers and hyphens).</p>
        <ol className="flex flex-col gap-3">
          {content.pastProjects.map((p, i) => (
            <li key={p.id} className="grid items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <Field label="Label (English)">
                <input maxLength={600} value={p.label.en} onChange={e => patch(d => void (d.pastProjects[i].label.en = e.target.value))} className={input} />
              </Field>
              <Field label="Label (Arabic)">
                <input dir="rtl" maxLength={600} value={p.label.ar} onChange={e => patch(d => void (d.pastProjects[i].label.ar = e.target.value))} className={input} />
              </Field>
              <Field label="Slug">
                <input
                  maxLength={80}
                  value={p.slug}
                  onChange={e => patch(d => void (d.pastProjects[i].slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')))}
                  className={input}
                />
              </Field>
              <RowTools
                label={`project ${i + 1}`}
                onUp={() => patch(d => move(d.pastProjects, i, -1))}
                onDown={() => patch(d => move(d.pastProjects, i, 1))}
                onRemove={() => patch(d => void d.pastProjects.splice(i, 1))}
              />
            </li>
          ))}
        </ol>
      </Card>

      {/* ── Save bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-bg/90 backdrop-blur-md lg:start-[240px]">
        <div className="flex flex-wrap items-center gap-4 px-5 py-3 md:px-8 lg:px-10">
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || !dirty || pending}
            className="min-h-11 rounded-full bg-white px-6 text-[12px] font-bold uppercase tracking-[1px] text-bg disabled:opacity-40"
          >
            {pending ? 'Saving…' : 'Save changes'}
          </button>
          {dirty && !pending && (
            <button type="button" onClick={() => (setContent(saved), setResult(null))} className="min-h-11 px-2 text-[13px] text-muted hover:text-fg">
              Discard
            </button>
          )}
          <p role="status" className={cn('text-[14px]', result?.ok ? 'text-emerald-300' : 'text-red-300')}>
            {result?.ok && <CheckCircle2 size={15} className="me-1.5 inline" aria-hidden="true" />}
            {result?.message ?? (dirty ? <span className="text-muted">Unsaved changes</span> : null)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={`${adminLabel} mb-1 block`}>{label}</span>
      {children}
    </label>
  );
}

function RowTools({ label, onUp, onDown, onRemove }: { label: string; onUp: () => void; onDown: () => void; onRemove: () => void }) {
  const btn = 'flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-white/5 hover:text-fg';
  return (
    <div className="flex gap-1">
      <button type="button" onClick={onUp} aria-label={`Move ${label} up`} className={btn}>
        <ArrowUp size={16} aria-hidden="true" />
      </button>
      <button type="button" onClick={onDown} aria-label={`Move ${label} down`} className={btn}>
        <ArrowDown size={16} aria-hidden="true" />
      </button>
      <button type="button" onClick={onRemove} aria-label={`Remove ${label}`} className={cn(btn, 'hover:text-red-300')}>
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
