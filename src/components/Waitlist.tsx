import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Lock, EyeOff, X, Copy, MessageCircle } from "lucide-react";
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

const CITIES = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Otra ciudad"];
const TARGET = 500;

const TRUST = [
  { Icon: Lock, text: "Cero spam. Solo te escribimos cuando tu acceso está listo." },
  { Icon: EyeOff, text: "Tus datos no se venden. Nunca." },
  { Icon: X, text: "Puedes salir de la lista cuando quieras." },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function Waitlist({ initialCount }: { initialCount: number }) {
  const join = useServerFn(joinWaitlist);

  const [count, setCount] = useState(initialCount);
  const [progress, setProgress] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ alreadyIn: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  // Animate progress bar on load and when count changes
  useEffect(() => {
    const target = Math.min(100, Math.round((count / TARGET) * 100));
    const id = requestAnimationFrame(() => setProgress(target));
    return () => cancelAnimationFrame(id);
  }, [count]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setErrorMsg("Cuéntanos tu nombre.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setErrorMsg("Escribe un email válido.");
      return;
    }
    if (!city) {
      setErrorMsg("Escoge tu ciudad.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await join({
        data: { name: trimmedName, email: trimmedEmail, city },
      });

      if (res.ok) {
        if (!res.alreadyIn) setCount((c) => c + 1); // optimistic +1
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

  const shareUrl =
    typeof window !== "undefined" ? window.location.origin : "https://zimil.app";
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
            Únete a la lista de espera. Te avisamos cuando ZIMIL abre en Bogotá
            y tu gemelo empieza a trabajar.
          </p>

          {/* Live counter */}
          <p
            className="mt-10 font-display text-3xl font-bold tracking-tight sm:text-4xl"
            style={{
              backgroundImage:
                "linear-gradient(120deg, var(--color-primary-glow), var(--color-accent))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            aria-live="polite"
          >
            {count.toLocaleString("es-CO")} personas ya están en lista
          </p>

          {/* Progress bar */}
          <div className="mx-auto mt-5 max-w-md">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full transition-[width] duration-1000 ease-out"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                  boxShadow:
                    "0 0 14px color-mix(in oklab, var(--color-primary) 60%, transparent)",
                }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Meta: {TARGET.toLocaleString("es-CO")} personas
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="relative mt-12">
          {/* glow halos */}
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
              borderColor: "color-mix(in oklab, var(--color-primary) 35%, transparent)",
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
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="wl-name" className="text-sm text-foreground/90">
                    ¿Cómo te llamas?
                  </Label>
                  <Input
                    id="wl-name"
                    name="name"
                    autoComplete="given-name"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl border-white/10 bg-background/60 text-base"
                    required
                    maxLength={80}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wl-email" className="text-sm text-foreground/90">
                    Tu email
                  </Label>
                  <Input
                    id="wl-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="para avisarte cuando abra"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-white/10 bg-background/60 text-base"
                    required
                    maxLength={254}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wl-city" className="text-sm text-foreground/90">
                    ¿En qué ciudad estás?
                  </Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger
                      id="wl-city"
                      className="h-12 rounded-xl border-white/10 bg-background/60 text-base"
                    >
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
                </div>

                {errorMsg && (
                  <p
                    role="alert"
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {errorMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Reservando..." : "Quiero mi lugar en ZIMIL 🚀"}
                </Button>
              </form>
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
      <svg
        viewBox="0 0 80 80"
        className="relative h-20 w-20"
        aria-hidden
      >
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
          style={{
            animation: "zimil-draw-circle 0.7s ease-out forwards",
          }}
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
          style={{
            animation: "zimil-draw-check 0.45s ease-out 0.6s forwards",
          }}
        />
      </svg>
      <style>{`
        @keyframes zimil-draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes zimil-draw-check {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
