'use client';

import { Trash2 } from 'lucide-react';
import { removeLead } from '@/app/admin/actions';

export function DeleteLeadButton({ id }: { id: number }) {
  return (
    <form
      action={removeLead}
      onSubmit={e => {
        if (!confirm('Delete this lead permanently? This cannot be undone. (It stays in Odoo if it was synced.)')) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-400/40 px-4 text-[13px] text-red-200 hover:bg-red-500/10">
        <Trash2 size={15} aria-hidden="true" /> Delete lead
      </button>
    </form>
  );
}
