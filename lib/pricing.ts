export interface QuoteLineItem {
  description: string;
  price: string;
}

export interface QuoteLead {
  service?: string;
  turfSize?: string;
  serviceDetail?: string;  // "Add-on" | "Standalone"
  postcode?: string;
  suburb?: string;
  // Legacy fields retained for compatibility
  levels?: string;
  panels?: string;
  roofType?: string;
  bedrooms?: string;
  type?: string;
  size?: string;
  timeline?: string;
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
  photoUrl?: string;
  photoUrls?: string[];
  // Wizard-computed fields
  areaM2?: number;
  billingPeriod?: string;
  estimatedTotal?: number;
  quoteLineItems?: QuoteLineItem[];
}

const TURF_SIZE_PRICING: Record<string, { low: number; high: number; note?: string }> = {
  "Up to 25m²":   { low: 150, high: 150, note: "Up to ~25m²" },
  "25–50m²":      { low: 300, high: 400, note: "25–50m²" },
  "50–100m²":     { low: 500, high: 800, note: "50–100m²" },
};

const TREATMENT_PRICING: Record<string, Record<string, { low: number; high: number }>> = {
  "Pet Odour & Stain Treatment": {
    "Add-on":     { low: 60,  high: 100 },
    "Standalone": { low: 120, high: 160 },
  },
  "Moss & Algae Removal": {
    "Add-on":     { low: 80,  high: 120 },
    "Standalone": { low: 100, high: 150 },
  },
};

const DEBRIS_PRICING = { low: 60, high: 100 };

export function isTurfService(service?: string): boolean {
  return (
    service === "Synthetic Turf Deep Clean" ||
    service === "Pet Odour & Stain Treatment" ||
    service === "Moss & Algae Removal" ||
    service === "Debris & Leaf Clearing" ||
    service === "Scheduled Maintenance Plans"
  );
}

export function calcTurfEstimate(lead: QuoteLead): { low: number; high: number; note?: string } | null {
  if (!lead.service) return null;

  if (lead.service === "Synthetic Turf Deep Clean") {
    const size = lead.turfSize ?? lead.levels;
    if (!size || size === "100m²+") return null;
    return TURF_SIZE_PRICING[size] ?? null;
  }

  if (lead.service === "Pet Odour & Stain Treatment" || lead.service === "Moss & Algae Removal") {
    const detail = lead.serviceDetail;
    if (!detail) return null;
    return TREATMENT_PRICING[lead.service]?.[detail] ?? null;
  }

  if (lead.service === "Debris & Leaf Clearing") {
    return DEBRIS_PRICING;
  }

  return null;
}

// Legacy estimate used for old Concreting/Landscaping/etc. quote types
export const PRICING: Record<string, Record<string, { low: number; high: number; unit: "m²" | "lm" }>> = {};

export function calcEstimate(a: QuoteLead): { low: number; high: number } | null {
  if (!a.service || !a.type || !a.size) return null;
  const p = PRICING[a.service]?.[a.type];
  if (!p) return null;
  const n = parseFloat(a.size);
  if (isNaN(n) || n <= 0) return null;
  const round = (v: number) => Math.round((v * n) / 100) * 100;
  return { low: round(p.low), high: round(p.high) };
}
