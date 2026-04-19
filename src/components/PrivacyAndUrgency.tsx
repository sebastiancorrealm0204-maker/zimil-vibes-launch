import { useEffect, useRef, useState } from "react";
import { X, Check, Clock, TrendingUp, Star } from "lucide-react";

type Row = { no: string; yes: string };

const ROWS: Row[] = [
  {
    no: "Guardar tus emails, fotos o contraseñas",
    yes: "Extraer solo patrones de comportamiento",
  },
  {
    no: "Vender tu información a terceros",
    yes: "Alquilar la capacidad predictiva de tu gemelo",
  },
  {
    no: "Compartir quién eres con las marcas",
    yes: "Responder preguntas anónimas sobre perfiles como el tuyo",
  },
  {
    no: "Guardar datos en servidores vulnerables",
    yes: "Si nos hackean, no hay nada personal que robar",
  },
];

const BENEFITS = [
  {
    icon: Clock,
    title: "Acceso antes del lanzamiento público",
    body: "Los de la lista entran primero, sin fila.",
  },
  {
    icon: TrendingUp,
    title: "Gemelo activo desde el día uno",
    body: "Mientras otros esperan, el tuyo ya genera.",
  },
  {
    icon: Star,
    title: "Condiciones de early adopter",
    body: "Las primeras personas definen las reglas del juego.",
  },
];

function useStaggeredReveal(count: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() => Array(count).fill(false));

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-index]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.revealIndex);
          setTimeout(() => {
            setVisible((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }, idx * 110);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

export function PrivacyAndUrgency() {
  const { ref: privacyRef, visible: rowsVisible } = useStaggeredReveal(ROWS.length);
  const { ref: benefitsRef, visible: benefitsVisible } = useStaggeredReveal(BENEFITS.length);

  return (
    <>
      {/* SECTION — Privacy */}
      <section
        id="privacidad"
        aria-label="Tus datos son tuyos. Siempre."
        className="relative w-full"
        style={{ backgroundColor: "#0D0D18" }}
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Tus datos son tuyos. Siempre.
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            No estamos pidiendo que{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              }}
            >
              confíes ciegamente.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Así funciona la privacidad en ZIMIL.
          </p>

          {/* Column headers */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-destructive sm:text-xs">
              Lo que NO hacemos
            </div>
            <div
              className="rounded-xl border border-success/30 bg-success/5 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wider sm:text-xs"
              style={{ color: "var(--color-success)" }}
            >
              Lo que SÍ hacemos
            </div>
          </div>

          <div ref={privacyRef} className="mt-3 space-y-3 sm:space-y-4">
            {ROWS.map((row, i) => {
              const isVisible = rowsVisible[i];
              return (
                <div
                  key={row.no}
                  data-reveal-index={i}
                  className={`grid grid-cols-2 gap-3 transition-all duration-700 ease-out sm:gap-5 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {/* NO column */}
                  <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-card/40 p-4 backdrop-blur-sm sm:p-5">
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 text-destructive">
                      <X className="h-4 w-4" />
                    </span>
                    <p className="text-sm leading-relaxed text-muted-foreground/80 line-through decoration-destructive/40 decoration-2 underline-offset-2 sm:text-base">
                      {row.no}
                    </p>
                  </div>

                  {/* YES column */}
                  <div
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card/70 p-4 backdrop-blur-sm transition-all sm:p-5"
                    style={{
                      boxShadow:
                        "0 0 0 1px color-mix(in oklab, var(--color-primary) 12%, transparent), 0 18px 40px -22px color-mix(in oklab, var(--color-primary) 55%, transparent)",
                    }}
                  >
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary-foreground"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-foreground sm:text-base">
                      {row.yes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION — Why now */}
      <section
        id="por-que-ahora"
        aria-label="Por qué entrar ahora"
        className="relative w-full"
        style={{ backgroundColor: "#08080E" }}
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Por qué entrar ahora y no después
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            El primer millar{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              }}
            >
              lo cambia todo.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            ZIMIL vale más cuando el pool de gemelos es grande. Los que entran
            primero tienen gemelos más consultados — porque son los únicos
            disponibles para las marcas del piloto.
          </p>

          <div
            ref={benefitsRef}
            className="mt-14 grid gap-5 sm:gap-6 md:grid-cols-3"
          >
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              const isVisible = benefitsVisible[i];
              return (
                <article
                  key={b.title}
                  data-reveal-index={i}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-22px_rgba(124,58,237,0.55)] sm:p-7 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  <span
                    aria-hidden
                    className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                    style={{
                      background:
                        i % 2 === 0
                          ? "var(--color-primary)"
                          : "var(--color-accent)",
                    }}
                  />
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
                      boxShadow:
                        "0 0 24px -6px color-mix(in oklab, var(--color-primary) 60%, transparent)",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold leading-tight text-foreground sm:text-xl">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {b.body}
                  </p>
                </article>
              );
            })}
          </div>

          <p
            className="mx-auto mt-14 max-w-3xl text-center font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl"
            style={{
              backgroundImage:
                "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            No hay segunda oportunidad de ser el primero.
          </p>
        </div>
      </section>
    </>
  );
}
