import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Melbourne Turf Cleaning Experts",
  description:
    "Turf Clean Pros is Melbourne's most trusted turf cleaning company. Thousands of happy customers, top-rated on Google, fully insured, all suburbs covered.",
  keywords: [
    "about Turf Clean Pros Melbourne",
    "Melbourne turf cleaning company",
    "trusted turf cleaners Melbourne",
    "fully insured turf cleaning Melbourne",
    "synthetic turf specialists Melbourne",
  ],
  openGraph: {
    title: "About Turf Clean Pros | Melbourne's Most Trusted Turf Cleaners",
    description:
      "Melbourne's most trusted turf cleaners. Thousands of happy customers, top-rated on Google, fully insured. Based in Bonnie Brook, all suburbs serviced.",
    url: "https://www.turfcleanpros.com.au/about",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/about" },
};

export default function AboutPage() {
  return <AboutClient />;
}
