import { createFileRoute } from "@tanstack/react-router";
import { BackgroundOrbs } from "@/components/BackgroundOrbs";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZIMIL — Tu comportamiento. Tu capital." },
      {
        name: "description",
        content:
          "ZIMIL convierte tu manera de moverte con la plata en oportunidades reales. Únete a la lista de espera.",
      },
      { property: "og:title", content: "ZIMIL — Tu comportamiento. Tu capital." },
      {
        property: "og:description",
        content:
          "ZIMIL convierte tu manera de moverte con la plata en oportunidades reales. Únete a la lista de espera.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <BackgroundOrbs />
      <Header />

      <main className="flex-1">
        {/* Hero coming next */}
        <section
          id="waitlist"
          aria-label="Lista de espera"
          className="mx-auto w-full max-w-6xl px-5 py-32 sm:px-8"
        >
          {/* Waitlist form placeholder — to be built next */}
        </section>
      </main>

      <Footer />
    </div>
  );
}
