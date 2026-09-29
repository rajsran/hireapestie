import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ | Synthetic Turf Cleaning Melbourne — Common Questions Answered",
  description:
    "Answers to the most common questions about synthetic turf cleaning in Melbourne. Pricing, pet odours, suburbs serviced, how it works, and how to book.",
  keywords: [
    "synthetic turf cleaning FAQ Melbourne",
    "how much does turf cleaning cost Melbourne",
    "pet odour turf treatment FAQ",
    "how often clean synthetic turf",
    "artificial grass cleaning questions",
    "turf cleaning near me",
  ],
  openGraph: {
    title: "FAQ | Synthetic Turf Cleaning Melbourne",
    description:
      "Common questions about synthetic turf cleaning in Melbourne — pricing, pet odours, suburbs covered, booking, and more.",
    url: "https://www.turfcleanpros.com.au/faq",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/faq" },
};

export default function FAQPage() {
  return <FAQClient />;
}
