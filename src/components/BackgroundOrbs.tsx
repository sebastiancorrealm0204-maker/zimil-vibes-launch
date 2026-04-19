/**
 * Soft, slow-moving violet + pink gradient orbs.
 * Sits behind all page content. Fixed position, pointer-events none.
 */
export function BackgroundOrbs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute -top-32 -left-32 h-[55vmax] w-[55vmax] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, var(--color-primary), transparent 65%)",
          animation: "var(--animate-orb-1)",
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[50vmax] w-[50vmax] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, var(--color-accent), transparent 65%)",
          animation: "var(--animate-orb-2)",
        }}
      />
      <div
        className="absolute -bottom-40 left-1/4 h-[45vmax] w-[45vmax] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, var(--color-primary-glow), transparent 65%)",
          animation: "var(--animate-orb-3)",
        }}
      />
      {/* subtle vignette to keep contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-background)_100%)]" />
    </div>
  );
}
