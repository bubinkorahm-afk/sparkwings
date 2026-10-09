import { Printer } from 'lucide-react';
import { Canvas, Line, u } from './Canvas';
import { QrMark } from './QrMark';
import { Sparkle } from '@/components/ui/Sparkle';

/** Sparkwings Billing: bilingual thermal receipt coming out of a small printer. */
export function BillingReceipt({ label }: { label: string }) {
  return (
    <Canvas w={520} h={360} label={label}>
      {/* printer */}
      <div
        className="absolute flex items-center justify-between border border-white/15 bg-[#1f1f1f] shadow-2xl shadow-black/50"
        style={{ left: u(150), top: u(20), width: u(220), height: u(60), borderRadius: u(16), paddingInline: u(16) }}
      >
        <Printer style={{ width: u(22), height: u(22) }} className="text-muted" />
        <span className="rounded-full bg-black/60" style={{ width: u(130), height: u(8) }} />
        <span className="rounded-full" style={{ width: u(10), height: u(10), background: 'var(--accent-2)' }} />
      </div>

      {/* receipt */}
      <div
        className="absolute bg-white text-[#121212] shadow-2xl shadow-black/60"
        style={{ left: u(175), top: u(70), width: u(170), padding: u(14), borderRadius: `0 0 ${u(6)} ${u(6)}`, transform: 'rotate(-2deg)' }}
      >
        <p dir="rtl" lang="ar" className="text-center font-semibold" style={{ fontSize: u(13), fontFamily: 'var(--font-plex-arabic)' }}>
          فاتورة ضريبية مبسطة
        </p>
        <p className="text-center uppercase text-[#666]" style={{ fontSize: u(7), letterSpacing: u(0.6) }}>Simplified tax invoice</p>
        <div className="flex flex-col border-y border-dashed border-black/20" style={{ gap: u(6), marginTop: u(10), paddingBlock: u(8) }}>
          {[80, 60, 90, 50].map((w, i) => (
            <div key={i} className="flex justify-between">
              <Line w={w} h={4} className="bg-black/15" />
              <Line w={22} h={4} className="bg-black/25" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: u(8) }}>
          <Line w={40} h={6} className="bg-black/30" />
          <Line w={44} h={9} className="bg-black/85" />
        </div>
        <div className="mx-auto" style={{ width: u(60), marginTop: u(10) }}>
          <QrMark className="h-auto w-full text-[#121212]" />
        </div>
      </div>

      {/* floating chips */}
      <div
        className="absolute border border-white/15 bg-[#202020]/90 text-fg shadow-xl shadow-black/50"
        style={{ left: u(10), top: u(150), padding: `${u(10)} ${u(14)}`, borderRadius: u(14), fontSize: u(12), transform: 'rotate(-5deg)' }}
      >
        English · العربية
      </div>
      <div
        className="absolute border border-white/15 bg-[#202020]/90 text-fg shadow-xl shadow-black/50"
        style={{ right: u(10), top: u(200), padding: `${u(10)} ${u(14)}`, borderRadius: u(14), fontSize: u(12), transform: 'rotate(5deg)' }}
      >
        Thermal · A4
      </div>
      <div className="absolute" style={{ right: u(70), top: u(40), width: u(24) }}>
        <Sparkle className="h-auto w-full" />
      </div>
    </Canvas>
  );
}
