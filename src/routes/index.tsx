import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { PrivacyAndUrgency } from "@/components/PrivacyAndUrgency";
import { DataHeist } from "@/components/DataHeist";
import { WaitlistModal } from "@/components/WaitlistModal";

export const Route = createFileRoute("/")(({
  head: () => ({
    meta: [
      { title: "ZIMIL — Tu comportamiento. Tu capital." },
      { name: "description", content: "Las marcas pagan por entenderte. Tú deberías cobrar. ZIMIL crea una IA que te representa y tú recibes el pago." },
    ],
  }),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">Algo salió mal</h1>
        <p className="mt-2 text-sm text-gray-400">{error.message}</p>
      </div>
    </div>
  ),
}));

function Index() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col bg-[#F8F7F4]">
      <Header onOpenWaitlist={() => setShowModal(true)} />

      <main className="flex-1">
        <Hero onOpenWaitlist={() => setShowModal(true)} />
        <HowItWorks />
        <DataHeist />
        <PrivacyAndUrgency />

        <section id="waitlist" className="bg-[#F8F7F4] border-t border-black/6 py-24 px-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Únete</p>
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4 sm:text-4xl">
            Tu lugar está esperando.
          </h2>
          <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto">
            Únete a la lista de espera. Te avisamos cuando ZIMIL abre en Colombia.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-block rounded-full px-8 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-85 shadow-lg shadow-violet-500/20"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
          >
            Quiero mi lugar en ZIMIL
          </button>
        </section>
      </main>

      <Footer />
      {showModal && <WaitlistModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
