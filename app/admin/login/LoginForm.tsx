'use client';

import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { login, type LoginState } from '../actions';

export function LoginForm() {
  const next = useSearchParams().get('next') ?? '/admin';
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="password" className="mb-2 block text-[11px] font-bold uppercase tracking-[1px] text-muted">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={Boolean(state.error)}
          aria-describedby="login-error"
          className="block min-h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-[16px] text-fg focus:border-accent-2 focus:outline-none aria-[invalid=true]:border-accent-1"
        />
      </div>
      <p id="login-error" role="alert" className="min-h-5 text-[14px] text-accent-1">
        {state.error}
      </p>
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-full bg-white text-[12px] font-bold uppercase tracking-[1px] text-bg disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
