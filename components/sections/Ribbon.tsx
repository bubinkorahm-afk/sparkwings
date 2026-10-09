import { getTranslations } from 'next-intl/server';
import { Sparkle } from '@/components/ui/Sparkle';

/** Full-bleed band tilted −3°, scrolling endlessly. Decorative; services are listed for screen readers. */
export async function Ribbon() {
  const t = await getTranslations('ribbon');
  const items = t.raw('items') as string[];

  return (
    <section aria-label={t('label')} className="relative overflow-hidden py-14 md:py-20">
      <ul className="sr-only">
        {items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="relative mx-[-15vw] w-[130vw] -rotate-3 overflow-hidden bg-band py-5 md:py-6">
        <div className="ribbon-track">
          {[0, 1].map(copy => (
            <div key={copy} className="flex shrink-0">
              {items.map(item => (
                <span
                  key={item}
                  className="font-display flex items-center gap-8 pe-8 text-[17px] font-medium whitespace-nowrap text-fg md:text-[20px]"
                >
                  {item}
                  <Sparkle size={22} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
