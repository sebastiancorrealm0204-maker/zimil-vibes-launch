import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { consultarPool, type Twin, type InsightResult } from "@/lib/groq";
import { Send, Users, Zap, TrendingDown, TrendingUp, Lock } from "lucide-react";

export const Route = createFileRoute("/brand")({
  head: () => ({ meta: [{ title: "ZIMIL — Panel de Marcas" }] }),
  component: BrandPanel,
});

const SUGGESTED = [
  "¿Cuántos usuarios del pool aceptarían pagar $15.000 más por envío express?",
  "Si lanzamos una membresía premium a $29.000/mes, ¿qué segmento tiene más probabilidad de suscribirse?",
  "¿Qué tan sensibles al precio son los millennials del pool comparado con mayores de 33?",
  "¿Cuál es el canal de pago preferido entre los menores de 25 del pool?",
  "Si subimos precios 15%, ¿cuántos usuarios probablemente buscarían alternativas?",
];

function PoolStats({ twins }: { twins: Twin[] }) {
  const segmentos = twins.reduce((acc: Record<string, number>, t) => {
    acc[t.miv.segmento] = (acc[t.miv.segmento] || 0) + 1;
    return acc;
  }, {});
  const avgPrecio = (twins.reduce((s, t) => s + t.miv.sensibilidad_precio, 0) / twins.length).toFixed(2);
  const avgTech = (twins.reduce((s, t) => s + t.miv.adopcion_tecnologica, 0) / twins.length).toFixed(2);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
      {[
        { label: "Gemelos en pool", value: twins.length.toString(), icon: <Users className="h-4 w-4" /> },
        { label: "Segmentos", value: Object.keys(segmentos).length.toString(), icon: <Zap className="h-4 w-4" /> },
        { label: "Sensib. precio prom.", value: avgPrecio, icon: <TrendingDown className="h-4 w-4" /> },
        { label: "Adopción tech prom.", value: avgTech, icon: <TrendingUp className="h-4 w-4" /> },
      ].map((s) => (
        <div key={s.label} className="rounded-xl border border-black/8 bg-white p-4">
          <div className="flex items-center gap-2 text-violet-600 mb-2">{s.icon}<span className="text-xs text-gray-400">{s.label}</span></div>
          <p className="font-display text-2xl font-bold text-gray-900">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ result, query }: { result: InsightResult; query: string }) {
  const confColor = result.confianza === "Alta" ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : result.confianza === "Media" ? "text-amber-600 bg-amber-50 border-amber-200"
    : "text-red-500 bg-red-50 border-red-200";

  return (
    <div className="rounded-2xl border border-black/8 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-black/6 bg-gray-50 px-6 py-4">
        <p className="text-xs text-gray-400 mb-1">Consulta</p>
        <p className="text-sm font-medium text-gray-700">"{query}"</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Main insight */}
        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <p className="text-gray-900 font-medium leading-relaxed">{result.insight}</p>
            <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${confColor}`}>
              Confianza {result.confianza}
            </span>
          </div>

          {/* Big percentage */}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl font-bold text-gray-900">{result.porcentaje}%</span>
            <span className="text-sm text-gray-400">del pool</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${result.porcentaje}%`, background: "linear-gradient(90deg, #7c3aed, #db2777)" }}
            />
          </div>
        </div>

        {/* Segmentos */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Distribución por segmento</p>
          <div className="space-y-2">
            {result.segmentos.map((seg) => (
              <div key={seg.nombre} className="flex items-center gap-3">
                <div className="w-32 shrink-0">
                  <p className="text-xs font-medium text-gray-700 truncate">{seg.nombre}</p>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${seg.pct}%`, background: "linear-gradient(90deg, #7c3aed, #db2777)" }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right">{seg.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendación */}
        <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-500 mb-2">Recomendación</p>
          <p className="text-sm text-gray-700 leading-relaxed">{result.recomendacion}</p>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-black/6">
          <span>{result.pool_size} gemelos consultados</span>
          <span className="font-medium text-gray-600">{result.costo_consulta}</span>
        </div>
      </div>
    </div>
  );
}

function BrandPanel() {
  const [twins, setTwins] = useState<Twin[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ query: string; result: InsightResult }[]>([]);
  const [error, setError] = useState("");
  const [poolLoading, setPoolLoading] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadPool() {
      setPoolLoading(true);
      try {
        const { data } = await supabase
          .from("waitlist")
          .select("name, age_range, city, miv")
          .not("miv", "is", null)
          .limit(200);

        const realTwins: Twin[] = (data || [])
          .filter((r) => r.miv?.sensibilidad_precio != null)
          .map((r) => ({ name: r.name, age_range: r.age_range, city: r.city, miv: r.miv }));

        setTwins(realTwins);
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
    if (!pregunta.trim() || loading) return;
    setError("");
    setLoading(true);
    try {
      const result = await consultarPool(pregunta, twins);
      setResults((prev) => [{ query: pregunta, result }, ...prev]);
      setQuery("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error consultando el pool");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleQuery(); }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/8 bg-[#F8F7F4]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <a href="/" className="font-display text-xl font-bold text-gray-900">ZIMIL</a>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">Panel de Marcas</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="h-3 w-3" />
            Demo privada
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        {/* Intro */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Consulta el pool de gemelos</h1>
          <p className="text-gray-500 text-sm">Haz cualquier pregunta en lenguaje natural. ZIMIL analiza los perfiles y te da un insight accionable en segundos.</p>
        </div>

        {/* Pool stats */}
        {poolLoading ? (
          <div className="h-24 rounded-xl bg-white border border-black/6 animate-pulse mb-8" />
        ) : (
          <PoolStats twins={twins} />
        )}

        {/* Query box */}
        <div className="rounded-2xl border border-black/8 bg-white p-4 mb-6 shadow-sm">
          <textarea
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ej: ¿Cuántos usuarios aceptarían un aumento de precio del 20%?"
            rows={2}
            className="w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/6">
            <p className="text-xs text-gray-400">{twins.length} gemelos disponibles · Enter para enviar</p>
            <button
              onClick={() => handleQuery()}
              disabled={loading || !query.trim()}
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {loading ? "Analizando..." : "Consultar"}
            </button>
          </div>
        </div>

        {/* Suggested queries */}
        {results.length === 0 && (
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Preguntas sugeridas</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => handleQuery(s)}
                  disabled={loading}
                  className="rounded-full border border-black/8 bg-white px-4 py-2 text-xs text-gray-600 transition-all hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {results.map((r, i) => (
            <InsightCard key={i} result={r.result} query={r.query} />
          ))}
        </div>
      </main>
    </div>
  );
}
