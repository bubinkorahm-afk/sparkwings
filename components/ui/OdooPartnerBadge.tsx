import Image from 'next/image';
import badge from '@/public/images/odoo-learning-partner.png';
import { cn } from '@/lib/utils';

/**
 * Official Odoo "Learning Partner" badge, unmodified, on a white plate.
 * Odoo's brand colours (purple "o", grey "doo") don't read on the dark site and the mark
 * must not be recoloured, so it always sits on white.
 */
export function OdooPartnerBadge({ width = 150, className, alt }: { width?: number; className?: string; alt: string }) {
  return (
    <span className={cn('inline-flex rounded-xl bg-white', className)} style={{ padding: Math.round(width * 0.07) }}>
      <Image src={badge} alt={alt} width={width} height={Math.round((width * badge.height) / badge.width)} />
    </span>
  );
}
