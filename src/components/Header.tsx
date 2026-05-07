import { useState } from "react";

export function Header({ onOpenWaitlist }: { onOpenWaitlist?: () => void } = {}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Cómo funciona", href: "#how-it-works" },
    { label: "Privacidad", href: "#privacidad" },
    { label: "Por qué ahora", href: "#por-que-ahora" },
  ];

  function scrollTo(id: string) {
    const el = document.getElementById(id.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 -z-10 border-b border-black/8 bg-[#F8F7F4]/90 backdrop-blur-xl" />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="/" className="font-display text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          ZIMIL
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
              className="text-sm text-gray-400 transition-colors hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenWaitlist?.()}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80 shadow-md shadow-violet-500/20"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
          >
            Quiero entrar
          </button>

          <button
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span className={`block h-px w-5 bg-gray-600 transition-all ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-gray-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-gray-600 transition-all ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-black/8 bg-[#F8F7F4]/95 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col px-5 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="rounded-xl px-3 py-3 text-sm text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-900"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
