import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { consultarPool, type Twin, type InsightResult } from "@/lib/groq";
import { Send, Users, Zap, TrendingUp, Lock, Download, ChevronRight, Building2, Tag, MapPin, Target } from "lucide-react";

export const Route = createFileRoute("/brand")({
  head: () => ({ meta: [{ title: "ZIMIL — Panel de Marcas" }] }),
  component: BrandPanel,
});

// ─── Types ───────────────────────────────────────────────────────────────────

interface BrandProfile {
  nombre: string;
  categoria: string;
  tamano: string;
  ciudad: string;
  objetivo: string;
  rangoPrecio: string;
}

interface HistoryEntry {
  id: number;
  query: string;
  result: InsightResult;
  followUps: string[];
  timestamp: Date;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIAS = ["Moda y ropa","Alimentos y delivery","Tech y gadgets","Salud y bienestar",
  "Entretenimiento","Financiero","Viajes y turismo","Educación","Hogar","Otro"];
const TAMANIOS = ["Pequeña (1-10 personas)","Mediana (11-100 personas)","Grande (100-500 personas)","Corporativo (500+)"];
const OBJETIVOS = ["Estrategia de precios","Canales de pago preferidos","Lanzamiento de producto",
  "Lealtad y retención","Segmentación de audiencia","Comportamiento de compra"];
const RANGOS_PRECIO = ["Menos de $30.000","$30.000 – $100.000","$100.000 – $300.000","$300.000 – $1.000.000","Más de $1.000.000"];
const CIUDADES_OP = ["Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Nacional","Internacional"];

const SUGGESTED = [
  "¿Cuántos usuarios del pool aceptarían pagar $15.000 más por envío express?",
  "Si lanzamos una membresía premium a $29.000/mes, ¿qué segmento tiene más probabilidad de suscribirse?",
  "¿Qué tan sensibles al precio son los millennials del pool comparado con mayores de 33?",
  "¿Cuál es el canal de pago preferido entre los menores de 25 del pool?",
  "Si subimos precios 15%, ¿cuántos usuarios probablemente buscarían alternativas?",
];

// ─── Onboarding ──────────────────────────────────────────────────────────────

function Onboarding({ onComplete }: { onComplete: (p: BrandProfile) => void }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<BrandProfile>>({});

  const steps = [
    {
      title: "Bienvenida al panel de marcas",
      sub: "Cuéntanos sobre tu empresa para que ZIMIL personalice cada insight para ti.",
      field: "nombre",
      label: "¿Cómo se llama tu empresa?",
      type: "input",
      placeholder: "Ej: Tienda Azul, FoodApp, etc.",
    },
    {
      title: "¿En qué categoría opera?",
      sub: "Usamos esto para filtrar los gemelos más relevantes para tu negocio.",
      field: "categoria",
      type: "pills",
      options: CATEGORIAS,
    },
    {
      title: "¿Qué tan grande es tu empresa?",
      sub: "El tamaño nos ayuda a calibrar el nivel de detalle del análisis.",
      field: "tamano",
      type: "pills",
      options: TAMANIOS,
    },
    {
      title: "¿Dónde opera principalmente?",
      sub: "Priorizamos gemelos de tu ciudad en los insights.",
      field: "ciudad",
      type: "pills",
      options: CIUDADES_OP,
    },
    {
      title: "¿Cuál es tu objetivo principal hoy?",
      sub: "Esto le dice a ZIMIL qué tipo de preguntas te serán más útiles.",
      field: "objetivo",
      type: "pills",
      options: OBJETIVOS,
    },
    {
      title: "¿Cuál es el rango de precio de tu producto/servicio?",
      sub: "Comparamos con el poder adquisitivo de los gemelos del pool.",
      field: "rangoPrecio",
      type: "pills",
      options: RANGOS_PRECIO,
    },
  ];

  const current = steps[step];
  const value = profile[current.field as keyof BrandProfile] || "";

  function select(val: string) {
    const updated = { ...profile, [current.field]: val };
    setProfile(updated);
    if (step < steps.length - 1) {
      setTimeout(() => setStep(s => s + 1), 180);
    } else {
      onComplete(updated as BrandProfile);
    }
  }

  function handleInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const val = (e.target as HTMLInputElement).value.trim();
      if (val) select(val);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-5">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-1 mb-10">
          {steps.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? "linear-gradient(90deg,#7c3aed,#db2777)" : "#E5E7EB" }} />
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-2">
          Paso {step + 1} de {steps.length}
        </p>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">{current.title}</h2>
        <p className="text-sm text-gray-400 mb-8">{current.sub}</p>

        {current.type === "input" ? (
          <input
            autoFocus
            type="text"
            placeholder={current.placeholder}
            defaultValue={value}
            onKeyDown={handleInput}
            className="w-full h-12 rounded-xl border border-black/10 bg-white px-4 text-sm text-gray-800 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
          />
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {current.options?.map((opt) => (
              <button key={opt} onClick={() => select(opt)}
                className={`rounded-xl border px-4 py-3 text-sm text-left transition-all ${
                  value === opt
                    ? "border-violet-400 bg-violet-50 text-violet-700 font-medium"
                    : "border-black/8 bg-white text-gray-700 hover:border-violet-300 hover:bg-violet-50/50"
                }`}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {current.type === "input" && (
          <button onClick={() => {
            const el = document.querySelector("input") as HTMLInputElement;
            if (el?.value.trim()) select(el.value.trim());
          }}
            className="mt-4 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>
            Continuar <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Pool Stats ───────────────────────────────────────────────────────────────

function PoolStats({ twins, brand }: { twins: Twin[]; brand: BrandProfile }) {
  const segmentos = [...new Set(twins.map(t => t.miv.segmento))];
  const ciudades = [...new Set(twins.map(t => t.miv.meta.city))].filter(Boolean);

  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 mb-6 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-violet-500" />
        <span className="text-sm font-semibold text-violet-800">{brand.nombre}</span>
        <span className="rounded-full bg-violet-200 px-2 py-0.5 text-xs text-violet-700">{brand.categoria}</span>
        <span className="rounded-full bg-violet-200 px-2 py-0.5 text-xs text-violet-700">{brand.tamano.split(" ")[0]}</span>
      </div>
      <div className="h-4 w-px bg-violet-200 hidden sm:block" />
      <div className="flex items-center gap-4 text-xs text-violet-600">
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{twins.length} gemelos</span>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ciudades.slice(0,3).join(", ")}</span>
        <span className="flex items-center gap-1"><Zap className="h-3 w-3" />{segmentos.length} segmentos</span>
        <span className="flex items-center gap-1"><Target className="h-3 w-3" />{brand.objetivo}</span>
      </div>
    </div>
  );
}

// ─── Export util ─────────────────────────────────────────────────────────────

function exportInsight(entry: HistoryEntry, brand: BrandProfile) {
  const date = entry.timestamp.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  const segs = entry.result.segmentos.map(s => `  • ${s.nombre}: ${s.pct}% — ${s.descripcion}`).join("\n");
  const follows = entry.followUps.map(f => `  → ${f}`).join("\n");
  const text = [
    "════════════════════════════════════════",
    "  ZIMIL — Insight de Investigación",
    "════════════════════════════════════════",
    `  Marca: ${brand.nombre} (${brand.categoria})`,
    `  Fecha: ${date}`,
    `  Pool: ${entry.result.pool_size} gemelos consultados`,
    "",
    "  CONSULTA",
    `  "${entry.query}"`,
    "",
    "  RESULTADO",
    `  ${entry.result.insight}`,
    "",
    `  ${entry.result.porcentaje}% del pool · Confianza ${entry.result.confianza}`,
    "",
    "  DISTRIBUCIÓN POR SEGMENTO",
    segs,
    "",
    "  RECOMENDACIÓN",
    `  ${entry.result.recomendacion}`,
    "",
    "  PREGUNTAS DE SEGUIMIENTO SUGERIDAS",
    follows,
    "",
    `  Costo: ${entry.result.costo_consulta}`,
    "════════════════════════════════════════",
    "  zimil-vibes-launch.vercel.app",
    "════════════════════════════════════════",
  ].join("\n");

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `zimil-insight-${entry.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Insight Card ─────────────────────────────────────────────────────────────

function InsightCard({ entry, brand, isNew }: { entry: HistoryEntry; brand: BrandProfile; isNew: boolean }) {
  const confColor = entry.result.confianza === "Alta"
    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : entry.result.confianza === "Media"
    ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-red-500 bg-red-50 border-red-200";

  const time = entry.timestamp.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`rounded-2xl border bg-white overflow-hidden transition-all duration-500 ${isNew ? "border-violet-300 shadow-lg shadow-violet-100" : "border-black/8"}`}>
      {/* Header */}
      <div className="border-b border-black/6 bg-gray-50 px-6 py-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Consulta · {time}</p>
          <p className="text-sm font-medium text-gray-700">"{entry.query}"</p>
        </div>
        <button onClick={() => exportInsight(entry, brand)}
          className="shrink-0 flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-gray-500 hover:border-violet-300 hover:text-violet-600 transition-colors">
          <Download className="h-3 w-3" />
          Exportar
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Main insight */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="text-gray-900 font-medium leading-relaxed">{entry.result.insight}</p>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${confColor}`}>
              Confianza {entry.result.confianza}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl font-bold text-gray-900">{entry.result.porcentaje}%</span>
            <span className="text-sm text-gray-400">del pool</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${entry.result.porcentaje}%`, background: "linear-gradient(90deg,#7c3aed,#db2777)" }} />
          </div>
        </div>

        {/* Segmentos */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Distribución por segmento</p>
          <div className="space-y-2">
            {entry.result.segmentos.map((seg) => (
              <div key={seg.nombre} className="flex items-center gap-3">
                <div className="w-36 shrink-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{seg.nombre}</p>
                  <p className="text-xs text-gray-400 truncate">{seg.descripcion}</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full"
                    style={{ width: `${seg.pct}%`, background: "linear-gradient(90deg,#7c3aed,#db2777)" }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{seg.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendación */}
        <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-500 mb-2">Recomendación para {brand.nombre}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{entry.result.recomendacion}</p>
        </div>

        {/* Follow-ups */}
        {entry.followUps.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Preguntas de seguimiento sugeridas</p>
            <div className="space-y-2">
              {entry.followUps.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-500">
                  <span className="mt-0.5 text-violet-400">→</span>
                  <span className="leading-relaxed">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-black/6">
          <span>{entry.result.pool_size} gemelos consultados · {brand.categoria} · {brand.ciudad}</span>
          <span className="font-medium text-gray-600">{entry.result.costo_consulta}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

function BrandPanel() {
  const [brand, setBrand] = useState<BrandProfile | null>(null);
  const [twins, setTwins] = useState<Twin[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [newestId, setNewestId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [poolLoading, setPoolLoading] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    async function loadPool() {
      setPoolLoading(true);
      try {
        const { data } = await supabase
          .from("waitlist")
          .select("name, age_range, city, miv")
          .not("miv", "is", null)
          .limit(200);
        const allTwins: Twin[] = (data || [])
          .filter((r) => r.miv?.sensibilidad_precio != null)
          .map((r) => ({ name: r.name, age_range: r.age_range, city: r.city, miv: r.miv }));
        setTwins(allTwins);
      } catch {
        setTwins([]);
      } finally {
        setPoolLoading(false);
      }
    }
    loadPool();
  }, []);

  async function handleQuery(q?: string) {
    const pregunta = q || query;
    if (!pregunta.trim() || loading || !brand) return;
    setError("");
    setLoading(true);
    try {
      const result = await consultarPool(pregunta, twins, brand);
      const followUps = result.follow_ups || [];
      const id = ++counterRef.current;
      const entry: HistoryEntry = { id, query: pregunta, result, followUps, timestamp: new Date() };
      setHistory(prev => [entry, ...prev]);
      setNewestId(id);
      setQuery("");
      setTimeout(() => setNewestId(null), 3000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error consultando el pool");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleQuery(); }
  }

  if (!brand) return <Onboarding onComplete={(p) => setBrand(p)} />;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-[#F8F7F4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <a href="/" className="font-display text-xl font-bold text-gray-900">ZIMIL</a>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">Panel de Marcas</span>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <span className="text-xs text-gray-400">{history.length} consulta{history.length > 1 ? "s" : ""} esta sesión</span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="h-3 w-3" />Demo privada
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Consulta el pool de gemelos</h1>
          <p className="text-gray-500 text-sm">Haz cualquier pregunta en lenguaje natural. ZIMIL analiza los perfiles y te da un insight accionable en segundos.</p>
        </div>

        {poolLoading ? (
          <div className="h-16 rounded-xl bg-white border border-black/6 animate-pulse mb-6" />
        ) : (
          <PoolStats twins={twins} brand={brand} />
        )}

        <div className="rounded-2xl border border-black/8 bg-white p-4 mb-6 shadow-sm">
          <textarea ref={inputRef} value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ej: ¿Qué segmento de ${brand.ciudad} aceptaría mejor un aumento de precio para ${brand.categoria}?`}
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none leading-relaxed" />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/6">
            <p className="text-xs text-gray-400">{twins.length} gemelos disponibles · Enter para enviar</p>
            <button onClick={() => handleQuery()} disabled={loading || !query.trim()}
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-4 w-4" />}
              {loading ? "Analizando..." : "Consultar"}
            </button>
          </div>
        </div>

        {history.length === 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Preguntas sugeridas para {brand.categoria}</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => handleQuery(s)} disabled={loading}
                  className="rounded-full border border-black/8 bg-white px-4 py-2 text-xs text-gray-600 transition-all hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 disabled:opacity-50">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}

        <div className="space-y-6">
          {history.map((entry) => (
            <InsightCard key={entry.id} entry={entry} brand={brand} isNew={entry.id === newestId} />
          ))}
        </div>
      </main>
    </div>
  );
}
