import { useEffect, useRef, useState } from "react";

const PLATFORMS = [
  { label: "Redes sociales", action: "venden tu perfil de intereses" },
  { label: "Buscadores", action: "venden tu historial de búsqueda" },
  { label: "Apps de video", action: "venden tu tiempo de pantalla" },
  { label: "Tiendas online", action: "venden tus hábitos de compra" },
  { label: "Apps de música", action: "venden tu perfil de consumo" },
  { label: "Redes laborales", action: "venden tu perfil profesional" },
];

export function DataHeist() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="w-full bg-white border-t border-black/6 py-24 px-5">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">El problema</p>
        <h2
          className="text-center font-display text-3xl font-bold text-gray-900 sm:text-4xl mb-3 transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)" }}
        >
          Cada vez que usas internet,{" "}
          <span className="text-gray-400">alguien gana con tus datos. Menos tú.</span>
        </h2>
        <p className="text-center text-sm text-gray-400 mb-14 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transitionDelay: "100ms" }}>
          Esto ocurre ahora mismo, mientras lees esto.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {PLATFORMS.map((p, i) => (
            <div
              key={p.label}
              className="flex items-center justify-between rounded-xl border border-black/6 bg-gray-50 px-5 py-4 transition-all duration-700"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(12px)", transitionDelay: `${i * 80}ms` }}
            >
              <div>
                <p className="text-sm font-medium text-gray-700">{p.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.action}</p>
              </div>
              <span className="text-xs font-medium text-red-400">sin pagarte</span>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-8 text-center transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transitionDelay: "500ms" }}
        >
          <p className="text-gray-500 text-sm mb-1">La alternativa existe.</p>
          <p className="text-gray-900 font-bold text-lg">Con ZIMIL, ese dinero es tuyo.</p>
        </div>
      </div>
    </section>
  );
}
