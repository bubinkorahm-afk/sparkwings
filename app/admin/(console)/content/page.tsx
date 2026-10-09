import type { Metadata } from 'next';
import { Suspense } from 'react';
import { requireAdmin } from '@/lib/admin-session';
import { getDb } from '@/lib/db';
import { getSiteContentFresh } from '@/lib/content';
import { DbNotice, PageHeader } from '@/components/admin/ui';
import { ContentEditor } from '@/components/admin/ContentEditor';

export const metadata: Metadata = { title: 'Site content' };

export default function ContentPage() {
  return (
    <>
      <PageHeader title="Site content" />
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <Editor />
      </Suspense>
    </>
  );
}

async function Editor() {
  await requireAdmin();
  const db = await getDb();
  const content = await getSiteContentFresh();
  return (
    <>
      <DbNotice kind={db?.kind ?? null} />
      <ContentEditor initial={content} canSave={Boolean(db)} />
    </>
  );
}
