export const PRICING: Record<string, Record<string, { low: number; high: number; unit: "m²" | "lm" }>> = {
  Concreting: {
    "Plain Concrete":      { low: 60,  high: 70,  unit: "m²" },
    "Coloured Concrete":   { low: 70,  high: 80,  unit: "m²" },
    "Exposed Aggregate":   { low: 100, high: 110, unit: "m²" },
  },
  Landscaping: {
    "Full Garden Design":   { low: 80,  high: 150, unit: "m²" },
    "Turf / Instant Lawn":  { low: 30,  high: 60,  unit: "m²" },
    "Artificial Grass":     { low: 70,  high: 120, unit: "m²" },
    "Paving & Hardscaping": { low: 63,  high: 170, unit: "m²" },
  },
  Decking: {
    "Hardwood (Merbau)":   { low: 280, high: 290, unit: "m²" },
    "Composite Decking":   { low: 300, high: 320, unit: "m²" },
  },
  Fencing: {
    "Colorbond Steel": { low: 100, high: 120, unit: "lm" },
    "Timber Paling":   { low: 100, high: 120, unit: "lm" },
  },
};

export interface QuoteLead {
  service?: string;
  levels?: string;
  panels?: string;
  roofType?: string;
  bedrooms?: string;
  postcode?: string;
  suburb?: string;
  // Legacy fields used by old quote forms
  type?: string;
  size?: string;
  timeline?: string;
  name?: string;
  email?: string;
  phone?: string;
}

const GUTTER_LEVELS_PRICING: Record<string, { low: number; high: number }> = {
  "1 level":  { low: 149, high: 250 },
  "2 levels": { low: 300, high: 450 },
};

export function isTurfService(service?: string): boolean {
  return (
    service === "Residential Turf Cleaning" ||
    service === "Commercial Turf Cleaning" ||
    service === "Bird Proofing Mesh"
  );
}

export function calcTurfEstimate(lead: QuoteLead): { low: number; high: number; note?: string } | null {
  if (!lead.service) return null;
  if (lead.service === "Commercial Turf Cleaning") return null;
  if (lead.service === "Bird Proofing Mesh") {
    const match = lead.panels?.match(/^(\d+)/);
    if (match) {
      const count = Number(match[1]);
      return { low: count * 30, high: count * 40 };
    }
    return null;
  }
  if (!lead.levels) return null;
  return GUTTER_LEVELS_PRICING[lead.levels] ?? null;
}

export function calcEstimate(a: QuoteLead): { low: number; high: number } | null {
  if (!a.service || !a.type || !a.size) return null;
  const p = PRICING[a.service]?.[a.type];
  if (!p) return null;
  const n = parseFloat(a.size);
  if (isNaN(n) || n <= 0) return null;
  const round = (v: number) => Math.round((v * n) / 100) * 100;
  return { low: round(p.low), high: round(p.high) };
}
