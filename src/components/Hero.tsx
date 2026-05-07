import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhoneMockup } from "@/components/PhoneMockup";

function scrollToId(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

export function Hero({ onOpenWaitlist }: { onOpenWaitlist?: () => void }) {
  return (
    <section
      aria-label="Hero"
      className="relative mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-8 sm:pt-16 lg:min-h-[calc(100vh-72px)] lg:py-20"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        {/* LEFT: copy */}
        <div className="text-center lg:text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-foreground/90 backdrop-blur sm:text-xs">
            <span
              className="inline-block h-4 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white sm:text-[11px]"
              style={{
                background:
                  "linear-gradient(120deg, var(--color-primary), var(--color-accent))",
              }}
            >
              🔒 Lista de espera
            </span>
            <span className="text-muted-foreground">Colombia · Cupos limitados</span>
          </div>

          {/* H1 */}
          <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Llevas años generando valor{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              }}
            >
              para otros.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
            Tus hábitos, tus gustos, tu vida — y tú nunca has visto un peso.
            ZIMIL cambia eso: tu comportamiento genera ingresos reales, directamente para ti.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col items-center gap-4 lg:items-start">
            <Button asChild variant="hero" size="xl">
              <a href="#waitlist" onClick={(e) => { e.preventDefault(); onOpenWaitlist?.(); }}>
                Quiero mi lugar
              </a>
            </Button>

            <a
              href="#how-it-works"
              onClick={scrollToId("how-it-works")}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ¿Cómo funciona?
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* RIGHT: phone mockup */}
        <div className="relative">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
