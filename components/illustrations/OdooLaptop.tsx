import { Canvas, Line, u } from './Canvas';
import { Sparkle } from '@/components/ui/Sparkle';

/** Laptop with a gradient screen and white UI panels, plus floating "CRM" and "Inventory" cards. */
export function OdooLaptop({ label }: { label: string }) {
  return (
    <Canvas w={520} h={400} label={label}>
      {/* Screen */}
      <div
        className="absolute overflow-hidden border border-white/15 bg-surface-2"
        style={{ left: u(50), top: u(40), width: u(420), height: u(270), borderRadius: `${u(16)} ${u(16)} 0 0`, padding: u(10) }}
      >
        <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: u(8), background: 'var(--grad-brand)' }}>
          {/* top bar */}
          <div className="flex items-center bg-black/20" style={{ height: u(24), gap: u(5), paddingInline: u(10) }}>
            {[0, 1, 2].map(i => (
              <span key={i} className="rounded-full bg-white/60" style={{ width: u(6), height: u(6) }} />
            ))}
          </div>
          {/* sidebar + panels */}
          <div className="flex" style={{ gap: u(10), padding: u(12) }}>
            <div className="flex flex-col bg-white/20" style={{ width: u(70), gap: u(8), padding: u(10), borderRadius: u(8), height: u(200) }}>
              {[40, 50, 34, 46, 30].map((w, i) => (
                <Line key={i} w={w} h={5} className="bg-white/70" />
              ))}
            </div>
            <div className="grid flex-1 grid-cols-2" style={{ gap: u(10) }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="bg-white shadow-lg shadow-black/10" style={{ borderRadius: u(8), padding: u(10), height: u(95) }}>
                  <Line w={50} h={5} className="bg-black/20" />
                  <Line w={80} h={10} className="bg-black/70" style={{ marginTop: u(8) }} />
                  <div className="flex items-end" style={{ gap: u(4), height: u(36), marginTop: u(10) }}>
                    {[50, 80, 60, 100, 70].map((h, j) => (
                      <span key={j} className="flex-1 rounded-t-[2px]" style={{ height: `${h}%`, background: j === 3 && i % 2 === 0 ? 'var(--accent-1)' : 'rgba(0,0,0,0.12)' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Base */}
      <div
        className="absolute bg-gradient-to-b from-line-strong to-surface-2"
        style={{ left: u(20), top: u(310), width: u(480), height: u(16), borderRadius: `0 0 ${u(14)} ${u(14)}` }}
      />

      <FloatCard label="CRM" style={{ left: u(0), top: u(170), transform: 'rotate(-6deg)' }} lines={[60, 44]} />
      <FloatCard label="Inventory" style={{ right: u(0), top: u(10), transform: 'rotate(5deg)' }} lines={[70, 50]} />
      <div className="absolute" style={{ right: u(40), bottom: u(20), width: u(26) }}>
        <Sparkle className="h-auto w-full" />
      </div>
    </Canvas>
  );
}

function FloatCard({ label, lines, style }: { label: string; lines: number[]; style: React.CSSProperties }) {
  return (
    <div
      className="absolute border border-white/15 bg-chip/85 shadow-xl shadow-black/50 backdrop-blur-md"
      style={{ width: u(130), padding: u(12), borderRadius: u(14), ...style }}
    >
      <div className="flex items-center" style={{ gap: u(6) }}>
        <span className="rounded-full" style={{ width: u(8), height: u(8), background: 'var(--grad-brand)' }} />
        <span className="font-medium text-fg" style={{ fontSize: u(12) }}>{label}</span>
      </div>
      {lines.map((w, i) => (
        <Line key={i} w={w} h={5} className="bg-white/20" style={{ marginTop: u(8) }} />
      ))}
    </div>
  );
}
