type Props = { className?: string; mono?: boolean };

export function RoamioLogo({ className = "", mono = false }: Props) {
  return (
    <span
      className={`font-display text-2xl font-semibold tracking-tight ${className}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      <span className={mono ? "" : "text-primary"}>Roam</span>
      <span className={mono ? "" : "text-ocean"}>io</span>
    </span>
  );
}
