import { cn } from '@/lib/utils';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
  as?: React.ElementType;
}

/**
 * GlassCard — translucent glass panel with blur, used throughout the site.
 */
export function GlassCard({
  children,
  className,
  hover = true,
  padding = 'p-6',
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'glass relative overflow-hidden',
        padding,
        hover && 'transition-all duration-300 hover:border-white/20 hover:-translate-y-1',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
