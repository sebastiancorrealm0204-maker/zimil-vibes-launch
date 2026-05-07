import { useEffect } from "react";
import { X } from "lucide-react";

export function WaitlistModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          <X className="h-4 w-4" />
        </button>
        <iframe
          src="/waitlist.html"
          className="w-full rounded-3xl border-0"
          style={{ height: "600px", maxHeight: "85vh" }}
          title="Lista de espera ZIMIL"
        />
      </div>
    </div>
  );
}
