import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Synthetic Turf Cleaning Services Melbourne | Deep Clean, Pet Treatment & More",
  description:
    "Professional synthetic turf cleaning services across all Melbourne suburbs. Deep clean from $150, pet odour treatment, moss removal, debris clearing & maintenance plans. Fully insured, 4.9★ rated.",
  keywords: [
    "synthetic turf cleaning Melbourne",
    "turf deep clean Melbourne",
    "pet odour turf treatment Melbourne",
    "moss algae removal synthetic turf",
    "turf maintenance plan Melbourne",
    "artificial grass cleaning Melbourne",
  ],
  openGraph: {
    title: "Synthetic Turf Cleaning Services Melbourne | Deep Clean, Pet Treatment & More",
    description:
      "Professional synthetic turf cleaning services across all Melbourne suburbs. Deep clean from $150, pet odour treatment, moss removal, debris clearing & maintenance plans.",
    url: "https://www.turfcleanpros.com.au/services",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
