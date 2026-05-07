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
      <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5 text-xs text-black/50 mb-8">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
        Lista de espera · Colombia
      </div>

      <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
        Llevas años generando valor{" "}
        <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg, #7c3aed, #db2777)" }}>
          para otros.
        </span>
      </h1>

      <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
        Tus hábitos, tus gustos, tu vida valen dinero. Solo que ese dinero nunca llega a ti. ZIMIL lo cambia.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={() => onOpenWaitlist?.()}
          className="rounded-full px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-85 shadow-lg shadow-violet-500/20"
          style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
        >
          Quiero mi lugar
        </button>
        <a
          href="#how-it-works"
          onClick={scrollToId("how-it-works")}
          className="text-sm font-medium text-gray-400 transition-colors hover:text-gray-900"
        >
          Cómo funciona →
        </a>
      </div>
    </section>
  );
}
