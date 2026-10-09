import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight } from 'lucide-react';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Locale-less internal path (e.g. "/contact"), or a full URL with `external` */
  href?: string;
  external?: boolean;
  /** Show the ↗ arrow icon (mirrored in RTL). Defaults on for `secondary`. */
  arrow?: boolean;
  /** Analytics event fired on click (see components/Analytics.tsx) */
  track?: 'demo_click';
  children: React.ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[1px] rounded-full ' +
  'transition-[transform,background-color,border-color] duration-200 cursor-pointer select-none ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-white text-bg hover:bg-[#EDEDED] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-transparent text-fg border border-white/30 hover:border-white/60 hover:bg-white/5 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'bg-transparent text-muted hover:text-fg hover:bg-white/5',
};

// Every size keeps the 48px minimum touch target from the brief
const sizes: Record<Size, string> = {
  sm: 'min-h-12 px-5 text-[12px]',
  md: 'min-h-12 px-7 text-[12px]',
  lg: 'min-h-14 px-9 text-[13px]',
};

export function Arrow({ size = 15 }: { size?: number }) {
  return <ArrowUpRight size={size} strokeWidth={2.25} aria-hidden="true" className="shrink-0 rtl:-scale-x-100" />;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  arrow,
  track,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {children}
      {(arrow ?? variant === 'secondary') && <Arrow />}
    </>
  );

  if (href?.startsWith('#')) {
    return (
      <a href={href} className={classes} data-track={track}>
        {content}
      </a>
    );
  }
  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} data-track={track}>
        {content}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={classes} data-track={track}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={classes} data-track={track} {...props}>
      {content}
    </button>
  );
}

/** Outline pill "LEARN MORE ↗" link */
export function PillLink({
  href,
  children,
  className,
  external,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  return (
    <Button href={href} external={external} variant="secondary" className={className}>
      {children}
    </Button>
  );
}
