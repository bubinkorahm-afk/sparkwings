import { Check } from 'lucide-react';
import { Canvas, Line, u } from './Canvas';
import { QrMark } from './QrMark';
import { Sparkle } from '@/components/ui/Sparkle';

/** Tilted white tax invoice with QR and "ZATCA ✓" badge, plus a floating "Phase 2 · Cleared" glass card. */
export function ZatcaInvoice({ label }: { label: string }) {
  return (
    <Canvas w={520} h={420} label={label}>
      <div
        className="absolute bg-white text-[#121212] shadow-2xl shadow-black/60"
        style={{ left: u(130), top: u(20), width: u(260), padding: u(22), borderRadius: u(16), transform: 'rotate(-5deg)' }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p dir="rtl" lang="ar" className="font-semibold leading-tight" style={{ fontSize: u(20), fontFamily: 'var(--font-plex-arabic)' }}>
              فاتورة ضريبية
            </p>
            <p className="uppercase text-[#666]" style={{ fontSize: u(9), letterSpacing: u(1), marginTop: u(3) }}>Tax invoice</p>
          </div>
          <span
            className="inline-flex items-center font-bold text-white"
            style={{ gap: u(3), fontSize: u(9), padding: `${u(4)} ${u(8)}`, borderRadius: u(99), background: 'var(--grad-brand)' }}
          >
            ZATCA <Check style={{ width: u(10), height: u(10) }} strokeWidth={3} />
          </span>
        </div>
        <div className="grid grid-cols-2 border-y border-black/10" style={{ gap: u(8), marginTop: u(16), paddingBlock: u(12) }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i}>
              <Line w={40} h={4} className="bg-black/15" />
              <Line w={70} h={6} className="bg-black/40" style={{ marginTop: u(4) }} />
            </div>
          ))}
        </div>
        <div className="flex flex-col" style={{ gap: u(8), marginTop: u(12) }}>
          {[130, 100, 150].map((w, i) => (
            <div key={i} className="flex justify-between">
              <Line w={w} h={5} className="bg-black/10" />
              <Line w={34} h={5} className="bg-black/20" />
            </div>
          ))}
        </div>
        <div className="flex items-end justify-between" style={{ marginTop: u(16) }}>
          <div style={{ width: u(78) }}>
            <QrMark className="h-auto w-full text-[#121212]" />
          </div>
          <div className="text-end">
            <Line w={44} h={4} className="ms-auto bg-black/20" />
            <Line w={76} h={12} className="bg-black/85" style={{ marginTop: u(6) }} />
          </div>
        </div>
      </div>

      {/* Phase 2 card */}
      <div
        className="absolute border border-white/15 bg-[#202020]/85 shadow-xl shadow-black/50 backdrop-blur-md"
        style={{ right: u(10), bottom: u(40), padding: `${u(14)} ${u(18)}`, borderRadius: u(16), transform: 'rotate(4deg)' }}
      >
        <div className="flex items-center" style={{ gap: u(10) }}>
          <span className="flex items-center justify-center rounded-full bg-accent-2/15 text-accent-2" style={{ width: u(30), height: u(30) }}>
            <Check style={{ width: u(16), height: u(16) }} strokeWidth={3} />
          </span>
          <div>
            <p className="font-medium text-fg" style={{ fontSize: u(14) }}>Phase 2</p>
            <p className="text-muted" style={{ fontSize: u(11) }}>Cleared</p>
          </div>
        </div>
      </div>
      <div className="absolute" style={{ left: u(70), top: u(80), width: u(28) }}>
        <Sparkle className="h-auto w-full" />
      </div>
    </Canvas>
  );
}
