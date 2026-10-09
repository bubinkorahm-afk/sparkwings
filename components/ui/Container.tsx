import { cn } from '@/lib/utils';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Container — 1240px max-width, 20px side padding on mobile, 32px from md up.
 */
export function Container({ children, className, as: Tag = 'div' }: ContainerProps) {
  return <Tag className={cn('mx-auto w-full max-w-[1240px] px-5 md:px-8', className)}>{children}</Tag>;
}

/**
 * Section — semantic <section> with the standard 100–140px vertical rhythm.
 */
export function Section({
  children,
  className,
  id,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  return (
    <section id={id} className={cn('relative py-[100px] lg:py-[140px]', className)} {...props}>
      {children}
    </section>
  );
}
