import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Turf Cleaning Services Melbourne | Residential, Commercial & Bird Proofing",
  description:
    "Professional turf cleaning services across all Melbourne suburbs. Residential from $149, commercial turf cleaning, and bird proofing mesh installation. Fully insured, 4.9★ rated.",
  keywords: [
    "turf cleaning Melbourne",
    "residential turf cleaning Melbourne",
    "commercial turf cleaning Melbourne",
    "bird proofing mesh Melbourne",
    "turf cleaning price Melbourne",
  ],
  openGraph: {
    title: "Turf Cleaning Services Melbourne | Residential, Commercial & Bird Proofing",
    description:
      "Professional turf cleaning services across all Melbourne suburbs. Residential from $149, commercial turf cleaning, and bird proofing mesh installation.",
    url: "https://www.turfcleanpros.com.au/services",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
