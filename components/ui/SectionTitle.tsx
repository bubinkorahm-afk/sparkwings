import { cn } from '@/lib/utils';

/** Section heading — Unbounded, clamp(32px, 4vw, 54px). Pass `grad` for a gradient second part. */
export function SectionTitle({
  children,
  grad,
  eyebrow,
  className,
  id,
}: {
  children: React.ReactNode;
  grad?: React.ReactNode;
  eyebrow?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <p className="mb-4 text-[12px] font-bold uppercase tracking-[1px] text-muted">{eyebrow}</p>}
      <h2 id={id} className="font-display text-[clamp(32px,4vw,54px)] leading-[1.1] font-medium tracking-[-1.5px] text-fg">
        {children}
        {grad && (
          <>
            {' '}
            <span className="gradient-text">{grad}</span>
          </>
        )}
      </h2>
    </div>
  );
}

export const eyebrowCls = 'text-[12px] font-bold uppercase tracking-[1px]';
export const bodyCls = 'text-[16px] md:text-[17px] font-light leading-[1.7] text-muted';

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn(eyebrowCls, 'text-accent-2', className)}>{children}</p>;
}
