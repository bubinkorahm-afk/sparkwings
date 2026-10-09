'use client';

import { m } from 'framer-motion';

/**
 * Fade + rise 16px when scrolled into view, once.
 * Under prefers-reduced-motion, MotionConfig (MotionProvider) drops the movement and keeps only the fade.
 * Content is still in the HTML for SEO; a <noscript> rule in the root layout un-hides it without JS.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </m.div>
  );
}
