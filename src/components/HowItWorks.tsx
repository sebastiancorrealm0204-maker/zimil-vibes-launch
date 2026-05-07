import { useEffect, useRef, useState } from "react";

const HOW_STEPS = [
  { n: "01", title: "ZIMIL construye tu gemelo digital", body: "Una IA aprende cómo gastas, qué te gusta y cómo decides — sin guardar tus datos privados. Solo los patrones." },
  { n: "02", title: "Las marcas consultan tu gemelo", body: "Cualquier marca puede preguntarle a ZIMIL si un perfil como el tuyo compraría algo. Tu gemelo responde. Tú no haces nada." },
  { n: "03", title: "Tú recibes el pago", body: "Cada consulta genera un pago automático directo a tu cuenta. Sin tramitar nada, sin intermediarios." },
];

const BUILD_STEPS = [
  { step: "1", title: "Algunas preguntas rápidas", body: "Cuéntanos tus gustos, hábitos y estilo de vida. Solo toma 30 segundos.", badge: "Gemelo al 20%" },
  { step: "2", title: "Conecta tu correo", body: "Solo leemos emails de compras — confirmaciones y recibos. Nunca conversaciones personales.", badge: "Gemelo al 65%" },
  { step: "3", title: "Sube tu archivo de redes sociales", body: "Descárgalo desde la configuración de tu red. ZIMIL extrae tus intereses y estilo de vida — nada más.", badge: "Gemelo al 90%" },
  { step: "4", title: "Fotografía tus recibos", body: "¿Compraste en efectivo? 3 segundos y el recibo queda registrado. Captura lo que las apps no ven.", badge: "Gemelo al 100% 🔥" },
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

export function HowItWorks() {
  const how = useReveal();
  const build = useReveal();

  return (
    <div id="how-it-works">
      <section className="w-full bg-white border-t border-black/6">
        <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Qué es ZIMIL</p>
          <h2 className="text-center font-display text-3xl font-bold text-gray-900 sm:text-4xl mb-14">
            Una IA que trabaja por ti mientras haces tu vida
          </h2>

          <div ref={how.ref} className="space-y-3">
            {HOW_STEPS.map((s, i) => (
              <div
                key={s.n}
                className="flex gap-6 rounded-2xl border border-black/6 bg-gray-50 p-6 transition-all duration-700"
                style={{ opacity: how.visible ? 1 : 0, transform: how.visible ? "none" : "translateY(16px)", transitionDelay: `${i * 100}ms` }}
              >
                <span className="font-display text-3xl font-bold text-black/10 leading-none shrink-0 w-10">{s.n}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#F8F7F4] border-t border-black/6">
        <div className="mx-auto w-full max-w-4xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Construye tu gemelo</p>
          <h2 className="text-center font-display text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
            Empieza en 30 segundos. Mejora cuando quieras.
          </h2>
          <p className="text-center text-sm text-gray-400 mb-14">Más completo el gemelo, más consultas, más ingresos.</p>

          <div ref={build.ref} className="space-y-3">
            {BUILD_STEPS.map((s, i) => (
              <div
                key={s.step}
                className="flex items-start gap-5 rounded-2xl border border-black/6 bg-white px-6 py-5 transition-all duration-700"
                style={{ opacity: build.visible ? 1 : 0, transform: build.visible ? "none" : "translateY(16px)", transitionDelay: `${i * 100}ms` }}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
                >
                  {s.step}
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{s.body}</p>
                </div>
                <span className="shrink-0 rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-xs text-gray-500">
                  {s.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
