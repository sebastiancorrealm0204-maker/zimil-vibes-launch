import { Button } from "@/components/ui/button";

function handleCtaClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const el = document.getElementById("waitlist");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="absolute inset-0 -z-10 bg-background/60 backdrop-blur-xl" />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a
          href="/"
          className="zimil-logo-glow font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          aria-label="ZIMIL — inicio"
        >
          ZIMIL
        </a>

        <Button asChild size="sm" className="rounded-full px-5 font-semibold sm:size-default sm:px-6">
          <a href="#waitlist" onClick={handleCtaClick}>
            Quiero entrar
          </a>
        </Button>
      </div>
    </header>
  );
}
