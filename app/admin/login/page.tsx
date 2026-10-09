import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LogoMark } from '@/components/ui/SparkwingsLogo';
import { adminConfigured } from '@/lib/admin-auth';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage() {
  const configured = adminConfigured();

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-5">
      <div aria-hidden="true" className="glow-blob" style={{ width: 520, height: 520, background: 'var(--glow-a)', opacity: 0.35, top: -200, right: -160 }} />
      <div className="relative w-full max-w-[400px] rounded-[24px] border border-white/10 bg-surface p-8">
        <div className="flex items-center gap-3">
          <LogoMark height={36} />
          <div>
            <h1 className="font-display text-[18px] font-medium text-fg">Sparkwings Admin</h1>
            <p className="text-[13px] text-muted">Sign in to manage leads and site content.</p>
          </div>
        </div>
        {configured ? (
          <Suspense>
            <LoginForm />
          </Suspense>
        ) : (
          <div className="mt-6 rounded-2xl border border-accent-2/40 bg-accent-2/10 p-4 text-[14px] text-fg">
            Set <code className="text-accent-2">ADMIN_PASSWORD</code> and <code className="text-accent-2">ADMIN_SESSION_SECRET</code> (32+ random
            characters) in the environment, then restart. See README.
          </div>
        )}
      </div>
    </div>
  );
}
