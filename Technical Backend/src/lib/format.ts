export function kwh(value: number, digits = 1): string {
  return value.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function eur(value: number, digits = 2): string {
  return `EUR ${value.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export function pad(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}
