import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PrivacyAndUrgency } from "@/components/PrivacyAndUrgency";
import { DataHeist } from "@/components/DataHeist";
import { WaitlistModal } from "@/components/WaitlistModal";

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
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundOrbs />
      <Header onOpenWaitlist={() => setShowModal(true)} />

      <main className="flex-1">
        <Hero onOpenWaitlist={() => setShowModal(true)} />
        <HowItWorks />
        <PrivacyAndUrgency />
        <DataHeist />
        <section id="waitlist" style={{ backgroundColor: "#0D0D18" }} className="py-20 px-5 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Tu lugar está <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(120deg, #a855f7, #ec4899)" }}>esperando.</span></h2>
          <p className="text-white/50 mb-8 text-lg">Únete a la lista de espera. Te avisamos cuando ZIMIL abre en Colombia.</p>
          <button onClick={() => setShowModal(true)} className="inline-block rounded-full px-8 py-4 text-base font-bold text-white border-0 cursor-pointer" style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}>Quiero mi lugar en ZIMIL 🚀</button>
        </section>
      </main>

      <Footer />
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
