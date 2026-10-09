import { Canvas, Line, u } from './Canvas';
import { Sparkle } from '@/components/ui/Sparkle';

/** Browser window with a site mock, overlapped by a phone with an app mock. */
export function BrowserPhone({ label }: { label: string }) {
  return (
    <Canvas w={520} h={400} label={label}>
      {/* Browser */}
      <div
        className="absolute overflow-hidden border border-white/15 bg-surface-2 shadow-2xl shadow-black/50"
        style={{ left: u(10), top: u(30), width: u(400), height: u(290), borderRadius: u(16) }}
      >
        <div className="flex items-center border-b border-white/10" style={{ height: u(32), gap: u(6), paddingInline: u(12) }}>
          {[0, 1, 2].map(i => (
            <span key={i} className="rounded-full bg-white/25" style={{ width: u(8), height: u(8) }} />
          ))}
          <span className="rounded-full bg-white/[0.07]" style={{ marginInlineStart: u(14), width: u(180), height: u(14) }} />
        </div>
        <div style={{ padding: u(18) }}>
          <div className="overflow-hidden" style={{ height: u(110), borderRadius: u(10), background: 'var(--grad-brand)', padding: u(16) }}>
            <Line w={140} h={12} className="bg-white/90" />
            <Line w={100} h={12} className="bg-white/90" style={{ marginTop: u(6) }} />
            <span className="block rounded-full bg-white" style={{ width: u(60), height: u(18), marginTop: u(14) }} />
          </div>
          <div className="grid grid-cols-3" style={{ gap: u(10), marginTop: u(14) }}>
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-white/[0.06]" style={{ height: u(90), borderRadius: u(10), padding: u(10) }}>
                <span className="block rounded-full bg-white/20" style={{ width: u(18), height: u(18) }} />
                <Line w={60} h={5} className="bg-white/25" style={{ marginTop: u(10) }} />
                <Line w={44} h={5} className="bg-white/15" style={{ marginTop: u(6) }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phone */}
      <div
        className="absolute border border-white/15 bg-device shadow-2xl shadow-black/60"
        style={{ right: u(20), top: u(90), width: u(150), height: u(290), borderRadius: u(26), padding: u(10), transform: 'rotate(5deg)' }}
      >
        <div className="mx-auto rounded-full bg-white/15" style={{ width: u(44), height: u(5), marginBottom: u(12) }} />
        <div className="flex items-center justify-between">
          <Line w={60} h={8} className="bg-white/70" />
          <span className="rounded-full" style={{ width: u(18), height: u(18), background: 'var(--grad-brand)' }} />
        </div>
        <div className="bg-white/[0.07]" style={{ height: u(70), borderRadius: u(12), marginTop: u(12), padding: u(10) }}>
          <Line w={50} h={5} className="bg-white/25" />
          <Line w={80} h={12} className="bg-white/80" style={{ marginTop: u(8) }} />
        </div>
        <div className="flex flex-col" style={{ gap: u(7), marginTop: u(10) }}>
          {[80, 64, 72, 56].map((w, i) => (
            <div key={i} className="flex items-center bg-white/[0.05]" style={{ gap: u(7), padding: u(7), borderRadius: u(9) }}>
              <span className="rounded-full" style={{ width: u(10), height: u(10), background: i === 0 ? 'var(--accent-2)' : 'rgba(255,255,255,0.2)' }} />
              <Line w={w} h={5} className="bg-white/20" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute" style={{ left: u(30), bottom: u(20), width: u(24) }}>
        <Sparkle className="h-auto w-full" />
      </div>
    </Canvas>
  );
}
