export const DISCLAIMER =
  'Sentinel Solar prototype. All systems, people, addresses and figures shown are simulated demo data. No real inverters are connected and nothing is charged.';

export function Disclaimer({ className = '' }: { className?: string }) {
  return <p className={`text-xs italic ${className}`}>{DISCLAIMER}</p>;
}
