import { useEffect, useRef, useState } from "react";

const COMPANIES = [
  { name: "Meta", logo: "M", color: "#1877F2", action: "vendió tu perfil de intereses", value: 0.003 },
  { name: "Google", logo: "G", color: "#EA4335", action: "vendió tu historial de búsqueda", value: 0.007 },
  { name: "TikTok", logo: "T", color: "#FF0050", action: "vendió tu tiempo de pantalla", value: 0.005 },
  { name: "Amazon", logo: "A", color: "#FF9900", action: "vendió tus hábitos de compra", value: 0.009 },
  { name: "X", logo: "X", color: "#ffffff", action: "vendió tus opiniones e intereses", value: 0.002 },
  { name: "Spotify", logo: "S", color: "#1DB954", action: "vendió tu perfil de consumo musical", value: 0.004 },
  { name: "LinkedIn", logo: "in", color: "#0A66C2", action: "vendió tu perfil profesional", value: 0.006 },
  { name: "YouTube", logo: "▶", color: "#FF0000", action: "vendió tu historial de videos", value: 0.008 },
];

interface Transaction {
  id: number;
  company: typeof COMPANIES[0];
  timestamp: string;
}

function getTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, "0");
  const m = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function DataHeist() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [counterVisible, setCounterVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const idRef = useRef(0);

  // Intersection observer to trigger animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setCounterVisible(true), 800);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Add transactions periodically once visible
  useEffect(() => {
    if (!visible) return;

    // Seed initial transactions
    const initial: Transaction[] = [];
    for (let i = 0; i < 4; i++) {
      const company = COMPANIES[i % COMPANIES.length];
      initial.push({ id: idRef.current++, company, timestamp: getTime() });
    }
    setTransactions(initial);
    setTotal(initial.reduce((sum, t) => sum + t.company.value, 0));

    const interval = setInterval(() => {
      const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
      const newTx: Transaction = { id: idRef.current++, company, timestamp: getTime() };
      setTransactions((prev) => [newTx, ...prev].slice(0, 4));
      setTotal((prev) => prev + company.value);
    }, 3000);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Red glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-900/10 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            TRANSMISIÓN EN VIVO
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Cada vez que usas internet,
            <br />
            <span className="text-red-400">alguien gana dinero con tus datos.</span>
            <br />
            <span className="text-white/50">Menos tú.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Esto está pasando ahora mismo, mientras lees esto.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid md:grid-cols-2 gap-8 items-start">

          {/* Left — Live feed */}
          <div
            className="transition-all duration-700 delay-200"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
            }}
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-white/30 text-xs font-mono ml-2">data_market_feed.live</span>
              </div>

              <div className="p-4 space-y-2 min-h-[320px]">
                {transactions.map((tx, i) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-all duration-500"
                    style={{
                      opacity: i === 0 ? 1 : 1 - i * 0.12,
                      animation: i === 0 ? "slideIn 0.4s ease-out" : undefined,
                    }}
                  >
                    {/* Company logo */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        backgroundColor: tx.company.color + "22",
                        color: tx.company.color,
                        border: `1px solid ${tx.company.color}44`,
                      }}
                    >
                      {tx.company.logo}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white text-sm font-medium">{tx.company.name}</span>
                        <span className="text-white/40 text-xs">{tx.company.action}</span>
                      </div>
                      <div className="text-white/30 text-xs font-mono">{tx.timestamp}</div>
                    </div>

                    {/* Value */}
                    <div className="text-red-400 text-sm font-mono font-bold flex-shrink-0">
                      +${tx.company.value.toFixed(3)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Counter + reframe */}
          <div
            className="transition-all duration-700 delay-300 flex flex-col gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(24px)",
            }}
          >
            {/* Counter card */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
              <p className="text-white/40 text-sm font-mono mb-2">GENERADO HOY PARA OTROS</p>
              <div className="text-6xl font-bold text-red-400 font-mono tabular-nums">
                ${counterVisible ? total.toFixed(3) : "0.000"}
              </div>
              <p className="text-white/30 text-xs mt-2">y contando — cada 1.8 segundos</p>
            </div>

            {/* Logos grid */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-white/40 text-xs font-mono mb-4 text-center">EMPRESAS QUE USAN TUS DATOS</p>
              <div className="grid grid-cols-4 gap-3">
                {COMPANIES.map((c) => (
                  <div
                    key={c.name}
                    className="aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c.color + "15",
                      color: c.color,
                      border: `1px solid ${c.color}30`,
                    }}
                  >
                    {c.logo}
                  </div>
                ))}
              </div>
            </div>

            {/* Reframe */}
            <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-6 text-center">
              <p className="text-white/60 text-sm mb-1">La alternativa existe.</p>
              <p className="text-white font-bold text-lg">Con ZIMIL, ese dinero es tuyo.</p>
              <a
                href="#waitlist"
                className="mt-4 inline-block px-6 py-3 rounded-full text-sm font-bold text-white"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #db2777)",
                }}
              >
                Quiero mi parte →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
