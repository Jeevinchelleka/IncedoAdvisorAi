/**
 * Format a number as currency (USD)
 */
export function formatCurrency(value, compact = false) {
  if (value == null || isNaN(value)) return "—";
  if (compact) {
    if (Math.abs(value) >= 1_000_000_000)
      return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(value) >= 1_000_000)
      return `$${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000)
      return `$${(value / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a percentage
 */
export function formatPct(value, decimals = 1) {
  if (value == null || isNaN(value)) return "—";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format a number with commas
 */
export function formatNumber(value) {
  if (value == null || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Format a date string
 */
export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format month key "2024-01" → "Jan 2024"
 */
export function formatMonthKey(key) {
  if (!key) return "";
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
