import { useEffect, useRef, useState } from "react";
import { MessageCircle, Mail, Instagram, Camera } from "lucide-react";

type Step = {
  icon: typeof MessageCircle;
  title: string;
  body: string;
  badge: string;
  badgeGradient?: boolean;
};

const STEPS: Step[] = [
  {
    icon: MessageCircle,
    title: "3 preguntas rápidas",
    body: "Cómo describes tu estilo de vida, en qué gastas más, qué apps usas. 30 segundos.",
    badge: "Gemelo al 20%",
  },
  {
    icon: Mail,
    title: "Conecta Gmail",
    body: "Solo leemos emails de compras — confirmaciones, recibos, pedidos. Nunca tus conversaciones personales.",
    badge: "Gemelo al 65%",
  },
  {
    icon: Instagram,
    title: "Sube tu ZIP de Instagram",
    body: "Descárgalo en 2 minutos desde Configuración de Instagram. ZIMIL extrae tus intereses y estilo de vida — nada más.",
    badge: "Gemelo al 90%",
  },
  {
    icon: Camera,
    title: "Foto de tus recibos",
    body: "¿Compraste algo en efectivo? Fotografía el recibo. 3 segundos. Captura todo lo que las apps no ven.",
    badge: "Gemelo al 100% 🔥",
    badgeGradient: true,
  },
];

const CARDS = [
  {
    n: "01",
    title: "ZIMIL construye tu Gemelo Digital",
    body: "Una IA que aprende cómo gastas, qué te gusta y cómo decides — sin guardar tus datos privados. Solo los patrones.",
    border: "border-l-primary",
    accent: "var(--color-primary)",
  },
  {
    n: "02",
    title: "Las marcas le hacen preguntas a tu gemelo",
    body: "Nike, Rappi, un banco, una app — cualquier marca puede preguntarle a ZIMIL: «¿este tipo de persona compraría esto?» Tu gemelo responde. Tú no haces nada.",
    border: "border-l-accent",
    accent: "var(--color-accent)",
  },
  {
    n: "03",
    title: "Tú recibes el pago",
    body: "Cada vez que una marca consulta tu gemelo, el pago llega directo a tu cuenta. Automático. Sin tramitar nada.",
    border: "",
    accent: "linear-gradient(180deg, var(--color-primary), var(--color-accent))",
    isGradient: true,
  },
] as const;

function useInViewSequential(count: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() => Array(count).fill(false));

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-step-index]"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.stepIndex);
          // stagger reveal slightly so they cascade
          setTimeout(() => {
            setVisible((prev) => {
              if (prev[idx]) return prev;
              const next = [...prev];
              next[idx] = true;
              return next;
            });
          }, idx * 120);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" },
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { containerRef, visible };
}

export function HowItWorks() {
  const { containerRef, visible } = useInViewSequential(STEPS.length);

  return (
    <div id="how-it-works">
      {/* SECTION 1 — What is ZIMIL? */}
      <section
        aria-label="¿Qué es ZIMIL exactamente?"
        className="relative w-full"
        style={{ backgroundColor: "#0D0D18" }}
      >
        <div className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            ¿Qué es ZIMIL exactamente?
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Tu IA personal que trabaja{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              }}
            >
              mientras tú haces tu vida
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            No vendes tus datos. No compartes contraseñas. No instalas nada
            raro. Solo conectas lo que quieres y tu gemelo empieza a generar
            valor por ti.
          </p>

          <div className="mt-14 space-y-5">
            {CARDS.map((card) => (
              <article
                key={card.n}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_20px_60px_-20px_rgba(124,58,237,0.5)] sm:p-8 ${
                  card.isGradient ? "" : `border-l-4 ${card.border}`
                }`}
              >
                {card.isGradient && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-1"
                    style={{ background: card.accent }}
                  />
                )}
                <div className="grid items-start gap-5 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <span
                    className="font-display text-5xl font-bold leading-none sm:text-6xl"
                    style={{
                      backgroundImage: card.isGradient
                        ? "linear-gradient(135deg, var(--color-primary-glow), var(--color-accent))"
                        : `linear-gradient(180deg, ${card.accent}, color-mix(in oklab, ${card.accent} 60%, transparent))`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {card.n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {card.body}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 — Build your twin in 4 steps */}
      <section
        aria-label="Construye tu gemelo en 4 pasos"
        className="relative w-full"
        style={{ backgroundColor: "#08080E" }}
      >
        <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Construye tu gemelo en 4 pasos
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Empieza en 30 segundos.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              }}
            >
              Mejora cuando quieras.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            Cuanto más completo tu gemelo, más valiosas las consultas, más alto
            el pago. Tú decides hasta dónde llegar.
          </p>

          <div ref={containerRef} className="relative mt-14">
            {/* Vertical timeline line */}
            <span
              aria-hidden
              className="absolute left-[27px] top-2 bottom-2 w-px sm:left-[31px]"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-primary), color-mix(in oklab, var(--color-accent) 80%, transparent))",
              }}
            />

            <ol className="space-y-6">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                const isVisible = visible[i];
                return (
                  <li
                    key={step.title}
                    data-step-index={i}
                    className={`relative pl-16 transition-all duration-700 ease-out sm:pl-20 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                    }`}
                  >
                    {/* Icon node on the line */}
                    <span
                      className="absolute left-0 top-1 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-card text-foreground shadow-[0_0_24px_-6px_rgba(124,58,237,0.6)] sm:h-16 sm:w-16"
                      style={{
                        background:
                          "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 25%, var(--color-card)), color-mix(in oklab, var(--color-accent) 18%, var(--color-card)))",
                      }}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>

                    {/* Step card */}
                    <div className="group rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_20px_50px_-20px_rgba(124,58,237,0.55)] sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold text-foreground sm:text-xl">
                          <span className="mr-2 text-muted-foreground">
                            Paso {i + 1}
                          </span>
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {step.body}
                      </p>
                      <span
                        className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          step.badgeGradient
                            ? "text-primary-foreground"
                            : "text-primary-foreground"
                        }`}
                        style={
                          step.badgeGradient
                            ? {
                                background:
                                  "linear-gradient(120deg, var(--color-primary), var(--color-accent))",
                                boxShadow:
                                  "0 0 18px -4px color-mix(in oklab, var(--color-accent) 60%, transparent)",
                              }
                            : {
                                background:
                                  "color-mix(in oklab, var(--color-primary) 85%, transparent)",
                              }
                        }
                      >
                        {step.badge}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
