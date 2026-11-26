import type { Metadata } from "next";
import AboutClient from "./AboutClient";

const DESC =
  "Hire a Pestie is your pest inspection & control partner — eco-friendly, residential, commercial and pre-construction pest control across Melbourne, Geelong, Bendigo and Ballarat.";

export const metadata: Metadata = {
  title: "About Us | Expert Pest Control Services in Melbourne",
  description: DESC,
  keywords: [
    "about Hire a Pestie",
    "pest control company Melbourne",
    "eco-friendly pest control Melbourne",
    "residential and commercial pest control",
    "pre-construction pest control",
  ],
  openGraph: {
    title: "About Hire a Pestie | Pest Control Melbourne",
    description: DESC,
    url: "https://hireapestie.com.au/about",
  },
  alternates: { canonical: "https://hireapestie.com.au/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
