import { useState } from "react";
import { Lock, EyeOff, X, Copy, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CITIES = ["Bogotá","Medellín","Cali","Barranquilla","Cartagena","Bucaramanga","Pereira","Manizales","Santa Marta","Otra"];
const AGE_RANGES = ["18-24","25-32","33-40","Más de 40"];
const CATEGORIES = ["🍔 Comida y delivery","👗 Ropa y moda","📱 Tech y gadgets","✈️ Viajes y experiencias","💊 Salud y bienestar","🎮 Entretenimiento"];
const APPS = ["Nequi","Daviplata","Bancolombia","Rappi","MercadoPago","Efectivo principalmente"];
const TRUST = [
  { Icon: Lock, text: "Cero spam. Solo te escribimos cuando tu acceso está listo." },
  { Icon: EyeOff, text: "Tus datos no se venden. Nunca." },
  { Icon: X, text: "Puedes salir de la lista cuando quieras." },
];
const TOTAL_STEPS = 5;

function isValidEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function isValidPhone(p: string) { return /^\d{10}$/.test(p); }

const inputClass = "w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white placeholder-white/30 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500";
const btnGradient = "w-full rounded-full py-4 text-base font-bold text-white transition-all active:scale-95 cursor-pointer";

export function Waitlist() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [apps, setApps] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ alreadyIn: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const progress = (step / TOTAL_STEPS) * 100;

  function next() { setErrorMsg(null); setStep((s) => Math.min(TOTAL_STEPS, s + 1)); }
  function back() { setErrorMsg(null); setStep((s) => Math.max(1, s - 1)); }

  function handleStep1Next() {
    if (!name.trim()) { setErrorMsg("Cuéntanos tu nombre."); return; }
    if (!isValidEmail(email.trim())) { setErrorMsg("Escribe un email válido."); return; }
    if (!isValidPhone(phone.trim())) { setErrorMsg("Escribe un número de celular válido (10 dígitos)"); return; }
    next();
  }

  function toggleCategory(c: string) {
    setCategories((prev) => {
      if (prev.includes(c)) return prev.filter((x) => x !== c);
      if (prev.length >= 2) return prev;
      return [...prev, c];
    });
  }

  function toggleApp(a: string) {
    setApps((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  async function handleSubmit() {
    setErrorMsg(null);
    if (!city) { setErrorMsg("Escoge tu ciudad."); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        name: name.trim(), email: email.trim(), phone: phone.trim(),
        age_range: ageRange, top_categories: categories.join(", "),
        payment_apps: apps.join(", "), city, type: "user",
      });
      if (error) {
        if (error.code === "23505") setSuccess({ alreadyIn: true });
        else setErrorMsg("Algo falló. Intenta de nuevo.");
      } else {
        setSuccess({ alreadyIn: false });
      }
    } catch {
      setErrorMsg("Algo falló. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  const shareUrl = "https://zimil-vibes-launch.vercel.app/";
  const shareText = `Acabo de reservar mi lugar en ZIMIL — una IA que te paga cuando las marcas consultan tu perfil. Únete: ${shareUrl}`;

  function handleCopy() {
    navigator.clipboard?.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section id="waitlist" className="relative w-full" style={{ backgroundColor: "#0D0D18" }}>
      <div className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Tu lugar está{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg, #a855f7, #ec4899)" }}>
              esperando.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
            Únete a la lista de espera. Te avisamos cuando ZIMIL abre en Colombia y tu gemelo empieza a trabajar.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="rounded-3xl border border-violet-500/20 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8"
            style={{ boxShadow: "0 0 40px -8px rgba(139,92,246,0.4), 0 30px 60px -20px rgba(236,72,153,0.3)" }}>
            {success ? (
              <SuccessState alreadyIn={success.alreadyIn} onCopy={handleCopy} copied={copied} shareText={shareText} />
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>Paso {step} de {TOTAL_STEPS}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #db2777)" }} />
                  </div>
                </div>

                {step > 1 && (
                  <button type="button" onClick={back}
                    className="mb-4 inline-flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Atrás
                  </button>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">¿Cómo te llamas?</label>
                      <input className={inputClass} placeholder="Tu nombre" value={name}
                        onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="given-name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Tu email</label>
                      <input className={inputClass} type="email" placeholder="para avisarte cuando abra" value={email}
                        onChange={(e) => setEmail(e.target.value)} maxLength={254} autoComplete="email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-white/70">Tu celular</label>
                      <input className={inputClass} type="tel" inputMode="numeric" placeholder="Ej: 300 123 4567"
                        value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        maxLength={10} autoComplete="tel-national" />
                      <p className="text-xs text-white/30">Solo Colombia — sin código de país</p>
                    </div>
                    {errorMsg && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{errorMsg}</p>}
                    <button type="button" onClick={handleStep1Next} className={btnGradient}
                      style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>
                      Siguiente →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-semibold text-white">¿Cuántos años tienes?</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {AGE_RANGES.map((age) => (
                        <PillButton key={age} selected={ageRange === age}
                          onClick={() => { setAgeRange(age); setTimeout(() => next(), 200); }}>
                          {age}
                        </PillButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xl font-semibold text-white">¿En qué gastas más cada mes?</h3>
                      <p className="mt-1 text-sm text-white/40">Escoge hasta 2.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {CATEGORIES.map((c) => (
                        <PillButton key={c} selected={categories.includes(c)}
                          disabled={!categories.includes(c) && categories.length >= 2}
                          onClick={() => toggleCategory(c)}>
                          {c}
                        </PillButton>
                      ))}
                    </div>
                    <button type="button" onClick={next} disabled={categories.length === 0} className={btnGradient}
                      style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", opacity: categories.length === 0 ? 0.5 : 1 }}>
                      Siguiente →
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xl font-semibold text-white">¿Qué apps usas para pagar o comprar?</h3>
                      <p className="mt-1 text-sm text-white/40">Selecciona todas las que apliquen.</p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {APPS.map((a) => (
                        <PillButton key={a} selected={apps.includes(a)} onClick={() => toggleApp(a)}>
                          {a}
                        </PillButton>
                      ))}
                    </div>
                    <button type="button" onClick={next} disabled={apps.length === 0} className={btnGradient}
                      style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", opacity: apps.length === 0 ? 0.5 : 1 }}>
                      Siguiente →
                    </button>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-semibold text-white">¿En qué ciudad estás?</h3>
                    <select value={city} onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white focus:outline-none focus:border-violet-500">
                      <option value="" disabled style={{ backgroundColor: "#1a1a2e" }}>Selecciona tu ciudad</option>
                      {CITIES.map((c) => <option key={c} value={c} style={{ backgroundColor: "#1a1a2e" }}>{c}</option>)}
                    </select>
                    {errorMsg && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{errorMsg}</p>}
                    <button type="button" onClick={handleSubmit} disabled={submitting || !city} className={btnGradient}
                      style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)", opacity: (!city || submitting) ? 0.5 : 1 }}>
                      {submitting ? "Reservando..." : "Quiero mi lugar en ZIMIL 🚀"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <ul className="mx-auto mt-10 grid max-w-2xl gap-3 text-center sm:grid-cols-3">
          {TRUST.map(({ Icon, text }) => (
            <li key={text} className="flex items-start justify-center gap-2 text-xs text-white/40 sm:text-sm">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function PillButton({ children, selected, onClick, disabled }: {
  children: React.ReactNode; selected: boolean; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`rounded-full border px-4 py-3 text-sm font-medium transition-all ${selected ? "border-transparent text-white" : "border-white/10 bg-white/5 text-white hover:border-white/30"} ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
      style={selected ? { background: "linear-gradient(120deg, #7c3aed, #db2777)" } : undefined}>
      {children}
    </button>
  );
}

function SuccessState({ alreadyIn, onCopy, copied, shareText }: {
  alreadyIn: boolean; onCopy: () => void; copied: boolean; shareText: string;
}) {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  return (
    <div className="text-center">
      <AnimatedCheck />
      <h3 className="mt-6 text-3xl font-bold text-white">
        {alreadyIn ? "Ya estás en la lista 🎉" : "¡Estás dentro!"}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
        {alreadyIn ? "Te avisamos pronto en cuanto tu acceso esté listo."
          : "Te avisamos por email cuando tu acceso esté listo. Mientras tanto, cuéntale a alguien — entre más personas en la lista, antes abrimos."}
      </p>
      <div className="mt-7 flex flex-col items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/30">Comparte ZIMIL →</p>
        <div className="flex items-center justify-center gap-3">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-white/20 transition-all">
            <MessageCircle className="h-5 w-5" />
          </a>
          <button type="button" onClick={onCopy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-white hover:border-white/20 transition-all">
            <Copy className="h-4 w-4" />
            {copied ? "¡Copiado!" : "Copiar enlace"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimatedCheck() {
  return (
    <div className="relative mx-auto h-20 w-20">
      <span className="absolute inset-0 rounded-full opacity-60 blur-2xl"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }} />
      <svg viewBox="0 0 80 80" className="relative h-20 w-20">
        <defs>
          <linearGradient id="zimil-check-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="none" stroke="url(#zimil-check-gradient)"
          strokeWidth="3" strokeLinecap="round" strokeDasharray="226" strokeDashoffset="226"
          style={{ animation: "zimil-draw-circle 0.7s ease-out forwards" }} />
        <path d="M24 41 L36 53 L57 30" fill="none" stroke="url(#zimil-check-gradient)"
          strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="60" strokeDashoffset="60"
          style={{ animation: "zimil-draw-check 0.45s ease-out 0.6s forwards" }} />
      </svg>
      <style>{"@keyframes zimil-draw-circle { to { stroke-dashoffset: 0; } } @keyframes zimil-draw-check { to { stroke-dashoffset: 0; } }"}</style>
    </div>
  );
}
