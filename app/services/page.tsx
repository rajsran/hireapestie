import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

const TITLE = "Pest Control Services Melbourne | Residential, Commercial, Inspections & Pre-construction";
const DESC =
  "Hire a Pestie offers pre-construction pest control, pest inspections, residential and commercial pest control across Melbourne, Geelong, Bendigo and Ballarat. Eco-friendly, licensed and fully insured. Get a free quote.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "pest control Melbourne",
    "pre-construction pest control Melbourne",
    "pest inspection Melbourne",
    "residential pest control Melbourne",
    "commercial pest control Melbourne",
    "termite prevention Melbourne",
    "bed bug and rodent control",
  ],
  openGraph: {
    title: TITLE,
    description: DESC,
    url: "https://hireapestie.com.au/services",
  },
  alternates: { canonical: "https://hireapestie.com.au/services" },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
