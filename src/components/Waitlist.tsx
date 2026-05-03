import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, EyeOff, X, Copy, MessageCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { joinWaitlist } from "@/server/waitlist";

const CITIES = [
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Manizales",
  "Santa Marta",
  "Otra",
];

const AGE_RANGES = ["18-24", "25-32", "33-40", "Más de 40"];

const CATEGORIES = [
  "🍔 Comida y delivery",
  "👗 Ropa y moda",
  "📱 Tech y gadgets",
  "✈️ Viajes y experiencias",
  "💊 Salud y bienestar",
  "🎮 Entretenimiento",
];

const APPS = [
  "Nequi",
  "Daviplata",
  "Bancolombia",
  "Rappi",
  "MercadoPago",
  "Efectivo principalmente",
];

const TRUST = [
  { Icon: Lock, text: "Cero spam. Solo te escribimos cuando tu acceso está listo." },
  { Icon: EyeOff, text: "Tus datos no se venden. Nunca." },
  { Icon: X, text: "Puedes salir de la lista cuando quieras." },
];

const TOTAL_STEPS = 5;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone: string) {
  return /^\d{10}$/.test(phone);
}

export function Waitlist() {
  const join = useServerFn(joinWaitlist);

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

  function next() {
    setErrorMsg(null);
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function back() {
    setErrorMsg(null);
    setStep((s) => Math.max(1, s - 1));
  }

  function validateStep1() {
    if (!name.trim()) return "Cuéntanos tu nombre.";
    if (!isValidEmail(email.trim())) return "Escribe un email válido.";
    if (!isValidPhone(phone.trim()))
      return "Escribe un número de celular válido (10 dígitos)";
    return null;
  }

  function handleStep1Next() {
    const err = validateStep1();
    if (err) {
      setErrorMsg(err);
      return;
    }
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
    setApps((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  }

  async function handleSubmit() {
    setErrorMsg(null);
    if (!city) {
      setErrorMsg("Escoge tu ciudad.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await join({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          age_range: ageRange,
          top_categories: categories.join(", "),
          payment_apps: apps.join(", "),
          city,
        },
      });
      if (res.ok) {
        setSuccess({ alreadyIn: res.alreadyIn });
      } else {
        setErrorMsg(res.message ?? "Algo falló. Intenta de nuevo.");
      }
    } catch {
      setErrorMsg("Algo falló. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  const shareUrl = "https://zimil-vibes-launch.lovable.app/";
  const shareText = `Acabo de reservar mi lugar en ZIMIL — una IA que te paga cuando las marcas consultan tu perfil. Únete: ${shareUrl}`;

  function handleCopy() {
    if (typeof navigator === "undefined") return;
    navigator.clipboard?.writeText(shareText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {},
    );
  }

  return (
    <section
      id="waitlist"
      aria-label="Lista de espera"
      className="relative w-full"
      style={{ backgroundColor: "#0D0D18" }}
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-20 sm:px-8 sm:py-28">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Tu lugar está{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              }}
            >
              esperando.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Únete a la lista de espera. Te avisamos cuando ZIMIL abre en
            Colombia y tu gemelo empieza a trabajar.
          </p>
        </div>

        {/* Card */}
        <div className="relative mt-12">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-1 -z-10 rounded-3xl opacity-70 blur-2xl"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--color-primary) 45%, transparent), color-mix(in oklab, var(--color-accent) 35%, transparent))",
            }}
          />
          <div
            className="rounded-3xl border bg-card/80 p-6 backdrop-blur-xl sm:p-8"
            style={{
              borderColor:
                "color-mix(in oklab, var(--color-primary) 35%, transparent)",
              boxShadow:
                "0 0 40px -8px color-mix(in oklab, var(--color-primary) 50%, transparent), 0 30px 60px -20px color-mix(in oklab, var(--color-accent) 55%, transparent)",
            }}
          >
            {success ? (
              <SuccessState
                alreadyIn={success.alreadyIn}
                onCopy={handleCopy}
                copied={copied}
                shareText={shareText}
              />
            ) : (
              <>
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Paso {step} de {TOTAL_STEPS}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full transition-[width] duration-500 ease-out"
                      style={{
                        width: `${progress}%`,
                        background:
                          "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                        boxShadow:
                          "0 0 14px color-mix(in oklab, var(--color-primary) 60%, transparent)",
                      }}
                    />
                  </div>
                </div>

                {step > 1 && (
                  <button
                    type="button"
                    onClick={back}
                    className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Atrás
                  </button>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="wl-name" className="text-sm text-foreground/90">
                        ¿Cómo te llamas?
                      </Label>
                      <Input
                        id="wl-name"
                        autoComplete="given-name"
                        placeholder="Tu nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 rounded-xl border-white/10 bg-background/60 text-base"
                        maxLength={80}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wl-email" className="text-sm text-foreground/90">
                        Tu email
                      </Label>
                      <Input
                        id="wl-email"
                        type="email"
                        autoComplete="email"
                        placeholder="para avisarte cuando abra"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl border-white/10 bg-background/60 text-base"
                        maxLength={254}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wl-phone" className="text-sm text-foreground/90">
                        Tu celular
                      </Label>
                      <Input
                        id="wl-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="Ej: 300 123 4567"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        className="h-12 rounded-xl border-white/10 bg-background/60 text-base"
                        maxLength={10}
                      />
                      <p className="text-xs text-muted-foreground">
                        Solo Colombia — sin código de país
                      </p>
                    </div>

                    {errorMsg && <ErrorBox msg={errorMsg} />}

                    <Button
                      type="button"
                      variant="hero"
                      size="xl"
                      className="w-full"
                      onClick={handleStep1Next}
                    >
                      Siguiente →
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                      ¿Cuántos años tienes?
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {AGE_RANGES.map((age) => (
                        <PillButton
                          key={age}
                          selected={ageRange === age}
                          onClick={() => {
                            setAgeRange(age);
                            setTimeout(() => next(), 200);
                          }}
                        >
                          {age}
                        </PillButton>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                        ¿En qué gastas más cada mes?
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Escoge hasta 2.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {CATEGORIES.map((c) => (
                        <PillButton
                          key={c}
                          selected={categories.includes(c)}
                          disabled={
                            !categories.includes(c) && categories.length >= 2
                          }
                          onClick={() => toggleCategory(c)}
                        >
                          {c}
                        </PillButton>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="hero"
                      size="xl"
                      className="w-full"
                      onClick={next}
                      disabled={categories.length === 0}
                    >
                      Siguiente →
                    </Button>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                        ¿Qué apps usas para pagar o comprar?
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Selecciona todas las que apliquen.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {APPS.map((a) => (
                        <PillButton
                          key={a}
                          selected={apps.includes(a)}
                          onClick={() => toggleApp(a)}
                        >
                          {a}
                        </PillButton>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="hero"
                      size="xl"
                      className="w-full"
                      onClick={next}
                      disabled={apps.length === 0}
                    >
                      Siguiente →
                    </Button>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <h3 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                      ¿En qué ciudad estás?
                    </h3>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="h-12 rounded-xl border-white/10 bg-background/60 text-base">
                        <SelectValue placeholder="Selecciona tu ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        {CITIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {errorMsg && <ErrorBox msg={errorMsg} />}

                    <Button
                      type="button"
                      variant="hero"
                      size="xl"
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={submitting || !city}
                    >
                      {submitting ? "Reservando..." : "Quiero mi lugar en ZIMIL 🚀"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Trust micro-lines */}
        <ul className="mx-auto mt-10 grid max-w-2xl gap-3 text-center sm:grid-cols-3">
          {TRUST.map(({ Icon, text }) => (
            <li
              key={text}
              className="flex items-start justify-center gap-2 text-xs text-muted-foreground sm:text-sm"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {msg}
    </p>
  );
}

function PillButton({
  children,
  selected,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-4 py-3 text-sm font-medium transition-all sm:text-base ${
        selected
          ? "border-transparent text-primary-foreground"
          : "border-white/10 bg-background/40 text-foreground hover:border-white/30 hover:bg-background/70"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
      style={
        selected
          ? {
              background:
                "linear-gradient(120deg, var(--color-primary), var(--color-accent))",
              boxShadow:
                "0 0 24px -6px color-mix(in oklab, var(--color-primary) 60%, transparent)",
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function SuccessState({
  alreadyIn,
  onCopy,
  copied,
  shareText,
}: {
  alreadyIn: boolean;
  onCopy: () => void;
  copied: boolean;
  shareText: string;
}) {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="text-center">
      <AnimatedCheck />

      <h3 className="mt-6 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {alreadyIn ? "Ya estás en la lista 🎉" : "¡Estás dentro!"}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
        {alreadyIn
          ? "Te avisamos pronto en cuanto tu acceso esté listo."
          : "Te avisamos por email cuando tu acceso esté listo. Mientras tanto, cuéntale a alguien — entre más personas en la lista, antes abrimos."}
      </p>

      <div className="mt-7 flex flex-col items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Comparte ZIMIL →
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Compartir por WhatsApp"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-background/60 text-foreground transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_0_24px_-4px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copiar enlace"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-background/60 px-4 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_0_24px_-4px_color-mix(in_oklab,var(--color-accent)_60%,transparent)]"
          >
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
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-primary), transparent 70%)",
        }}
      />
      <svg viewBox="0 0 80 80" className="relative h-20 w-20" aria-hidden>
        <defs>
          <linearGradient id="zimil-check-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="url(#zimil-check-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="226"
          strokeDashoffset="226"
          style={{ animation: "zimil-draw-circle 0.7s ease-out forwards" }}
        />
        <path
          d="M24 41 L36 53 L57 30"
          fill="none"
          stroke="url(#zimil-check-gradient)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="60"
          strokeDashoffset="60"
          style={{ animation: "zimil-draw-check 0.45s ease-out 0.6s forwards" }}
        />
      </svg>
      <style>{`
        @keyframes zimil-draw-circle { to { stroke-dashoffset: 0; } }
        @keyframes zimil-draw-check { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
