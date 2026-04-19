import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

/**
 * Static, polished phone-style notification mockups.
 * Two cards float gently and have a soft violet glow.
 * Pure presentational — no real data.
 */
export function PhoneMockup() {
  // Delay second card so it fades in shortly after mount
  const [showSecond, setShowSecond] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowSecond(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-md select-none"
    >
      {/* ambient glow behind cards */}
      <div
        className="absolute -inset-10 -z-10 rounded-[3rem] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 60%), radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--color-accent) 50%, transparent), transparent 60%)",
        }}
      />

      {/* Primary notification */}
      <div
        className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-[0_20px_60px_-20px_rgba(124,58,237,0.55)] backdrop-blur-xl"
        style={{ animation: "float1 6s ease-in-out infinite" }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="inline-flex h-7 w-7 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
            }}
          >
            <Bell className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="font-semibold text-foreground">ZIMIL</span>
          <span aria-hidden>·</span>
          <span>Hace un momento</span>
        </div>

        <p className="mt-3 font-display text-base font-semibold text-foreground sm:text-lg">
          Nike consultó tu perfil
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">+$0.80</span> acreditados
        </p>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tu gemelo</span>
            <span className="font-semibold text-foreground">94% completo</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{
                width: "94%",
                background:
                  "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                boxShadow: "0 0 16px color-mix(in oklab, var(--color-primary) 60%, transparent)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Secondary notification — smaller, offset, fades in */}
      <div
        className={`mt-5 ml-8 max-w-[85%] rounded-2xl border border-white/10 bg-card/80 p-4 shadow-[0_14px_40px_-18px_rgba(236,72,153,0.55)] backdrop-blur-xl transition-all duration-700 ${
          showSecond ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ animation: showSecond ? "float2 7s ease-in-out infinite" : undefined }}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent), var(--color-primary))",
            }}
          >
            <Bell className="h-3 w-3 text-white" />
          </span>
          <span className="font-semibold text-foreground">ZIMIL</span>
          <span aria-hidden>·</span>
          <span>Hace un instante</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-foreground">
          Rappi consultó tu perfil
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">+$0.45</span> acreditados
        </p>
      </div>

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="float1"], [style*="float2"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
