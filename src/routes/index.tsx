import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PrivacyAndUrgency } from "@/components/PrivacyAndUrgency";
import { Waitlist } from "@/components/Waitlist";

const BuildZimil = lazy(() => import("@/components/BuildZimil").then(m => ({ default: m.BuildZimil })));
const DataHeist = lazy(() => import("@/components/DataHeist").then(m => ({ default: m.DataHeist })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZIMIL — Tu comportamiento. Tu capital." },
      {
        name: "description",
        content:
          "Las marcas pagan por entenderte. Tú deberías cobrar. ZIMIL crea una IA que te representa y tú recibes el pago. Únete a la lista de espera en Colombia.",
      },
      { property: "og:title", content: "ZIMIL — Tu comportamiento. Tu capital." },
      {
        property: "og:description",
        content:
          "Las marcas pagan por entenderte. Tú deberías cobrar. Únete a la lista de espera de ZIMIL en Colombia.",
      },
    ],
  }),
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
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundOrbs />
      <Header />

      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Suspense fallback={<div className="py-20" />}>
          <BuildZimil />
        </Suspense>
        <PrivacyAndUrgency />
        <Suspense fallback={<div className="py-20" />}>
          <DataHeist />
        </Suspense>
        <Waitlist />
      </main>

      <Footer />
    </div>
  );
}
