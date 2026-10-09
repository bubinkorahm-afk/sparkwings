import { cn } from '@/lib/utils';
import React from 'react';

interface GlowBlobProps {
  color: 'a' | 'b' | string;
  size?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * GlowBlob — an absolutely positioned blurred colour orb.
 * Renders as aria-hidden so it's invisible to screen readers.
 */
export function GlowBlob({ color, size = 520, opacity = 0.35, className, style }: GlowBlobProps) {
  const bg =
    color === 'a'
      ? 'var(--glow-a)'
      : color === 'b'
        ? 'var(--glow-b)'
        : color;

  return (
    <div
      aria-hidden="true"
      className={cn('glow-blob', className)}
      style={{
        width: size,
        height: size,
        background: bg,
        opacity,
        ...style,
      }}
    />
  );
}
