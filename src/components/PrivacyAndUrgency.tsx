import { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";

const ROWS = [
  { no: "Guardar tus emails, fotos o contraseñas", yes: "Extraer solo patrones de comportamiento" },
  { no: "Vender tu información a terceros", yes: "Alquilar la capacidad predictiva de tu gemelo" },
  { no: "Compartir quién eres con las marcas", yes: "Responder preguntas anónimas sobre perfiles" },
  { no: "Guardar datos en servidores vulnerables", yes: "Si nos hackean, no hay nada personal que robar" },
];

const BENEFITS = [
  { title: "Acceso antes del lanzamiento público", body: "Los de la lista entran primero, sin fila." },
  { title: "Gemelo activo desde el día uno", body: "Mientras otros esperan, el tuyo ya genera." },
  { title: "Condiciones de early adopter", body: "Las primeras personas definen las reglas del juego." },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function PrivacyAndUrgency() {
  const privacy = useReveal();
  const urgency = useReveal();

  return (
    <>
      {/* Privacidad */}
      <section id="privacidad" className="w-full" style={{ backgroundColor: "#08080E" }}>
        <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">Privacidad</p>
          <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl mb-4">
            Tus datos son tuyos. Siempre.
          </h2>
          <p className="text-center text-sm text-white/55 mb-14">No pedimos que confíes ciegamente — te mostramos cómo funciona.</p>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-red-400">Lo que NO hacemos</div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider text-emerald-400">Lo que SÍ hacemos</div>
          </div>

          <div ref={privacy.ref} className="space-y-2">
            {ROWS.map((row, i) => (
              <div
                key={row.no}
                className="grid grid-cols-2 gap-2 transition-all duration-700"
                style={{ opacity: privacy.visible ? 1 : 0, transform: privacy.visible ? "none" : "translateY(12px)", transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <X className="h-4 w-4 shrink-0 mt-0.5 text-red-400/60" />
                  <p className="text-xs leading-relaxed text-white/55 line-through decoration-red-400/30">{row.no}</p>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <Check className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400/80" />
                  <p className="text-xs leading-relaxed text-white/70">{row.yes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué ahora */}
      <section id="por-que-ahora" className="w-full" style={{ backgroundColor: "#0D0D18" }}>
        <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">Por qué ahora</p>
          <h2 className="text-center font-display text-3xl font-bold text-white sm:text-4xl mb-4">
            El primer millar lo cambia todo.
          </h2>
          <p className="text-center text-sm text-white/55 mb-14 max-w-xl mx-auto">
            ZIMIL vale más cuando hay más gemelos. Los que entran primero son los más consultados — porque son los únicos disponibles para las marcas del piloto.
          </p>

          <div ref={urgency.ref} className="grid gap-4 sm:grid-cols-3">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-700"
                style={{ opacity: urgency.visible ? 1 : 0, transform: urgency.visible ? "none" : "translateY(16px)", transitionDelay: `${i * 100}ms` }}
              >
                <h3 className="font-semibold text-white text-sm mb-2">{b.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-14 text-white/55 text-sm font-medium">
            No hay segunda oportunidad de ser el primero.
          </p>
        </div>
      </section>
    </>
  );
}
