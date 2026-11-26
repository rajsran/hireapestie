import type { Metadata } from "next";
import FAQClient from "./FAQClient";

const DESC =
  "Answers to common questions about pest control with Hire a Pestie — areas covered, pests we treat, safety, inspections, pre-construction termite protection, quotes and booking.";

export const metadata: Metadata = {
  title: "FAQ | Pest Control Melbourne — Common Questions Answered",
  description: DESC,
  keywords: [
    "pest control FAQ Melbourne",
    "pest control cost Melbourne",
    "is pest control safe for pets",
    "pre-construction termite treatment",
    "pest inspection Melbourne",
    "pest control Geelong Bendigo Ballarat",
  ],
  openGraph: {
    title: "FAQ | Pest Control Melbourne",
    description: DESC,
    url: "https://hireapestie.com.au/faq",
  },
  alternates: { canonical: "https://hireapestie.com.au/faq" },
};

export default function FAQPage() {
  return <FAQClient />;
}
