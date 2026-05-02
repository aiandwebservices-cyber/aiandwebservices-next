export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`lp-logo ${className ?? ''}`}>
      <span className="lot">Lot</span>
      <span className="pilot">Pilot</span>
      <span className="ai">.ai</span>
    </span>
  );
}
