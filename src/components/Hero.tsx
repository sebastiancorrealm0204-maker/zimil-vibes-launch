function scrollToId(id: string) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

export function Hero({ onOpenWaitlist }: { onOpenWaitlist?: () => void }) {
  return (
    <section aria-label="Hero" className="relative mx-auto w-full max-w-4xl px-5 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
        Lista de espera · Colombia
      </div>

      {/* H1 */}
      <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
        Llevas años generando valor{" "}
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg, #a78bfa, #f472b6)" }}>
          para otros.
        </span>
      </h1>

      {/* Sub */}
      <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/40 sm:text-lg">
        Tus hábitos, tus gustos, tu vida valen dinero. Solo que ese dinero nunca llega a ti. ZIMIL lo cambia.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={() => onOpenWaitlist?.()}
          className="rounded-full px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-85"
          style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
        >
          Quiero mi lugar
        </button>
        <a
          href="#how-it-works"
          onClick={scrollToId("how-it-works")}
          className="text-sm font-medium text-white/40 transition-colors hover:text-white"
        >
          Cómo funciona →
        </a>
      </div>
    </section>
  );
}
