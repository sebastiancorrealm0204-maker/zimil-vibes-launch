import { useEffect, useRef, useState } from "react";

const SOURCES = [
  {
    icon: "💬",
    title: "Tus respuestas iniciales",
    body: "Estilo de vida y preferencias",
  },
  {
    icon: "📧",
    title: "Gmail de compras",
    body: "Hábitos de gasto reales",
  },
  {
    icon: "📸",
    title: "Instagram ZIP",
    body: "Identidad y aspiraciones",
  },
  {
    icon: "🧾",
    title: "Fotos de recibos",
    body: "Economía informal capturada",
  },
];

const PROFILE_FIELDS = [
  { key: "perfil", label: '"Millennial Digital-First"', kind: "text" as const, value: 0 },
  { key: "sensibilidad_precio", label: "", kind: "bar" as const, value: 45 },
  { key: "lealtad_marca", label: "", kind: "bar" as const, value: 70 },
  { key: "adopcion_tecnologica", label: "", kind: "bar" as const, value: 88 },
  { key: "categorías_top", label: '"Gastronomía · Tech"', kind: "text" as const, value: 0 },
  { key: "completitud", label: "", kind: "counter" as const, value: 94 },
];

export function BuildZimil() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-source-index]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.sourceIndex);
          setTimeout(() => {
            setActiveStep((prev) => (idx > prev ? idx : prev));
          }, idx * 250);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5, rootMargin: "0px 0px -10% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Animate counter when last source is active
  useEffect(() => {
    if (activeStep < SOURCES.length - 1) return;
    let n = 0;
    const target = 94;
    const id = setInterval(() => {
      n += 2;
      if (n >= target) {
        n = target;
        clearInterval(id);
      }
      setCounter(n);
    }, 30);
    return () => clearInterval(id);
  }, [activeStep]);

  return (
    <section
      id="build-zimil"
      aria-label="Cómo se construye tu ZIMIL"
      className="relative w-full"
      style={{ backgroundColor: "#08080E" }}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Cómo se construye tu ZIMIL
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Así se construye{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
            }}
          >
            tu ZIMIL
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
          No es magia — es tu comportamiento real convertido en un perfil que
          las marcas quieren entender.
        </p>

        <div ref={ref} className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT: data sources */}
          <ul className="space-y-4">
            {SOURCES.map((src, i) => {
              const isActive = activeStep >= i;
              return (
                <li
                  key={src.title}
                  data-source-index={i}
                  className={`flex items-start gap-4 rounded-2xl border p-5 backdrop-blur-sm transition-all duration-700 sm:p-6 ${
                    isActive
                      ? "border-white/20 bg-card/70 opacity-100"
                      : "border-white/5 bg-card/30 opacity-50"
                  }`}
                  style={
                    isActive
                      ? {
                          boxShadow:
                            "0 0 30px -10px color-mix(in oklab, var(--color-primary) 60%, transparent)",
                        }
                      : undefined
                  }
                >
                  <span
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-all ${
                      isActive ? "scale-100" : "scale-95 grayscale"
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 30%, var(--color-card)), color-mix(in oklab, var(--color-accent) 25%, var(--color-card)))",
                          }
                        : { background: "var(--color-card)" }
                    }
                  >
                    {src.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground sm:text-lg">
                      {src.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      → {src.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* RIGHT: profile card */}
          <div
            className="relative rounded-2xl border bg-card/80 p-6 font-mono text-sm backdrop-blur-xl sm:p-7"
            style={{
              borderColor:
                "color-mix(in oklab, var(--color-primary) 45%, transparent)",
              boxShadow:
                "0 0 40px -8px color-mix(in oklab, var(--color-primary) 55%, transparent)",
            }}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              tu_zimil.json
            </p>

            <div className="mt-5 space-y-4">
              {PROFILE_FIELDS.map((f, i) => {
                const isOn = activeStep >= Math.min(i, SOURCES.length - 1);
                return (
                  <div
                    key={f.key}
                    className="transition-opacity duration-700"
                    style={{ opacity: isOn ? 1 : 0.25 }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-primary">{f.key}:</span>
                      {f.kind === "text" && (
                        <span className="text-foreground">{f.label}</span>
                      )}
                      {f.kind === "counter" && (
                        <span
                          className="font-bold"
                          style={{
                            backgroundImage:
                              "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                          }}
                        >
                          {isOn ? counter : 0}%
                        </span>
                      )}
                      {f.kind === "bar" && (
                        <span className="text-muted-foreground">
                          {isOn ? f.value : 0}%
                        </span>
                      )}
                    </div>
                    {f.kind === "bar" && (
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full transition-[width] duration-1000 ease-out"
                          style={{
                            width: `${isOn ? f.value : 0}%`,
                            background:
                              "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                            boxShadow:
                              "0 0 10px color-mix(in oklab, var(--color-primary) 60%, transparent)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p
          className="mx-auto mt-14 max-w-3xl text-center font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl"
          style={{
            backgroundImage:
              "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Cuanto más completo tu ZIMIL, más marcas te consultan, más alto el
          pago.
        </p>
      </div>
    </section>
  );
}
