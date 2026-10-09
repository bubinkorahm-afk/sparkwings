/**
 * SparkwingsLogo — the official winged "SW" mark (public/images/logo-mark.png, cropped from
 * "Sparkwings new logo.png") plus the wordmark as live text, so it stays crisp and readable on
 * the dark site. Colours follow the logo: "Spark…ings" light, the "w" in the logo's bright blue.
 * (The PNG's own navy lettering is too dark for a #121212 background.)
 *
 * Variants:
 *  - "icon"     — mark only
 *  - "wordmark" — mark + "Sparkwings" (header)
 *  - "full"     — mark + wordmark + legal suffix + tagline (footer)
 *
 * Decorative by default: wrap it in a link with its own aria-label.
 */
import Image from 'next/image';
import mark from '@/public/images/logo-mark.png';
import { cn } from '@/lib/utils';

/** The logo's highlight blue (the "w" in Sparkwings) */
const LOGO_BLUE = '#1677E5';

interface LogoProps {
  variant?: 'icon' | 'wordmark' | 'full';
  /** Mark height in px; text scales with it */
  height?: number;
  className?: string;
}

export function LogoMark({ height = 36, className }: { height?: number; className?: string }) {
  return (
    <Image
      src={mark}
      alt=""
      aria-hidden="true"
      height={height}
      width={Math.round((height * mark.width) / mark.height)}
      priority
      className={cn('shrink-0 select-none', className)}
    />
  );
}

export function SparkwingsLogo({ variant = 'wordmark', height = 36, className }: LogoProps) {
  if (variant === 'icon') return <LogoMark height={height} className={className} />;

  return (
    <span className={cn('inline-flex items-center', className)} style={{ gap: height * 0.22 }} aria-hidden="true">
      <LogoMark height={height} />
      <span className="flex flex-col justify-center" dir="ltr">
        <span
          className="leading-none font-medium text-[#F5F5F5]"
          style={{ fontFamily: 'var(--font-unbounded)', fontSize: height * 0.5, letterSpacing: '-0.03em' }}
        >
          Spark<span style={{ color: LOGO_BLUE }}>w</span>ings
        </span>
        {variant === 'full' && (
          <>
            <span className="mt-1.5 text-muted" style={{ fontSize: Math.max(11, height * 0.28), letterSpacing: '0.06em' }}>
              ENTERPRISES OPC PVT. LTD.
            </span>
            <span className="mt-0.5 text-[#7FA6E8] italic" style={{ fontSize: Math.max(10, height * 0.25), letterSpacing: '0.04em' }}>
              TRANSFORMING IDEAS INTO TECHNOLOGY
            </span>
          </>
        )}
      </span>
    </span>
  );
}
