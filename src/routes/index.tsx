import { createFileRoute } from "@tanstack/react-router";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PrivacyAndUrgency } from "@/components/PrivacyAndUrgency";
import { getWaitlistUserCount } from "@/server/waitlist";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZIMIL — Tu comportamiento. Tu capital." },
      {
        name: "description",
        content:
          "Las marcas pagan por entenderte. Tú deberías cobrar. ZIMIL crea una IA que te representa y tú recibes el pago. Únete a la lista de espera en Bogotá.",
      },
      { property: "og:title", content: "ZIMIL — Tu comportamiento. Tu capital." },
      {
        property: "og:description",
        content:
          "Las marcas pagan por entenderte. Tú deberías cobrar. Únete a la lista de espera de ZIMIL en Bogotá.",
      },
    ],
  }),
  loader: async () => {
    const { count } = await getWaitlistUserCount();
    return { userCount: count };
  },
  staleTime: 30_000,
  component: Index,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold">Algo salió mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

function Index() {
  const { userCount } = Route.useLoaderData();

  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundOrbs />
      <Header />

      <main className="flex-1">
        <Hero userCount={userCount} />

        <HowItWorks />

        <PrivacyAndUrgency />

        <section
          id="waitlist"
          aria-label="Lista de espera"
          className="mx-auto w-full max-w-6xl px-5 py-32 sm:px-8"
        />
      </main>

      <Footer />
    </div>
  );
}
