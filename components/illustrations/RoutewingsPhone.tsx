import { MapPin } from 'lucide-react';
import { Canvas, Line, u } from './Canvas';
import { Sparkle } from '@/components/ui/Sparkle';

/** Routewings: phone with today's route + a floating "Van stock" card. */
export function RoutewingsPhone({ label }: { label: string }) {
  const stops = [true, true, false, false];
  return (
    <Canvas w={520} h={360} label={label}>
      {/* map-ish backdrop card */}
      <div
        className="absolute overflow-hidden border border-white/10 bg-surface-2"
        style={{ left: u(30), top: u(40), width: u(300), height: u(250), borderRadius: u(18) }}
      >
        <svg viewBox="0 0 300 250" className="h-full w-full" aria-hidden="true">
          <path d="M20 210 C 80 150, 60 90, 140 80 S 250 40, 280 30" fill="none" stroke="var(--accent-2)" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 12" />
          {[[20, 210], [140, 80], [280, 30]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="8" fill={i < 2 ? 'var(--accent-2)' : 'rgba(255,255,255,0.3)'} />
          ))}
          {[60, 120, 180].map(y => (
            <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="rgba(255,255,255,0.05)" />
          ))}
        </svg>
      </div>

      {/* phone */}
      <div
        className="absolute border border-white/15 bg-device shadow-2xl shadow-black/60"
        style={{ right: u(60), top: u(10), width: u(170), height: u(330), borderRadius: u(28), padding: u(12), transform: 'rotate(4deg)' }}
      >
        <div className="mx-auto rounded-full bg-white/15" style={{ width: u(46), height: u(5), marginBottom: u(12) }} />
        <p className="font-medium text-fg" style={{ fontSize: u(14) }}>Today&apos;s route</p>
        <p className="text-muted" style={{ fontSize: u(10) }}>Routewings</p>
        <ul className="flex flex-col" style={{ gap: u(8), marginTop: u(12) }}>
          {stops.map((done, i) => (
            <li key={i} className="flex items-center bg-white/[0.05]" style={{ gap: u(8), padding: u(8), borderRadius: u(10) }}>
              <MapPin style={{ width: u(12), height: u(12), color: done ? 'var(--accent-2)' : 'rgba(255,255,255,0.3)' }} />
              <Line w={[76, 60, 70, 52][i]} h={6} className="bg-white/20" />
            </li>
          ))}
        </ul>
        <span className="absolute block rounded-full text-center font-bold text-white" style={{ insetInline: u(12), bottom: u(14), padding: u(8), fontSize: u(10), background: 'var(--grad-brand)' }}>
          Close day
        </span>
      </div>

      {/* van stock card */}
      <div
        className="absolute border border-white/15 bg-chip/90 shadow-xl shadow-black/50"
        style={{ left: u(0), bottom: u(10), width: u(150), padding: u(12), borderRadius: u(14), transform: 'rotate(-5deg)' }}
      >
        <div className="flex items-center" style={{ gap: u(6) }}>
          <span className="rounded-full" style={{ width: u(8), height: u(8), background: 'var(--grad-brand)' }} />
          <span className="font-medium text-fg" style={{ fontSize: u(12) }}>Van stock</span>
        </div>
        {[70, 50].map((w, i) => (
          <Line key={i} w={w} h={5} className="bg-white/20" style={{ marginTop: u(8) }} />
        ))}
      </div>
      <div className="absolute" style={{ right: u(10), bottom: u(40), width: u(24) }}>
        <Sparkle className="h-auto w-full" />
      </div>
    </Canvas>
  );
}
