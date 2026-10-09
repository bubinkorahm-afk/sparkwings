import { cn } from '@/lib/utils';

/**
 * Canvas — a fixed design grid (w × h "design px") that scales fluidly with its width.
 * Children position themselves with u(n), which resolves to n design px at any size.
 * role="img" + aria-label makes the whole illustration one accessible image.
 */
export const u = (n: number) => `calc(var(--u) * ${n})`;

export function Canvas({
  w,
  h,
  label,
  className,
  children,
}: {
  w: number;
  h: number;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="img" aria-label={label} className={cn('w-full [container-type:inline-size]', className)}>
      <div className="relative w-full select-none" style={{ aspectRatio: `${w} / ${h}`, ['--u' as string]: `calc(100cqw / ${w})` }}>
        {children}
      </div>
    </div>
  );
}

/** Grey placeholder line used for skeleton text inside mock UIs */
export function Line({ w, h = 6, className, style }: { w: number; h?: number; className?: string; style?: React.CSSProperties }) {
  return <span className={cn('block rounded-full', className)} style={{ width: u(w), height: u(h), ...style }} />;
}
