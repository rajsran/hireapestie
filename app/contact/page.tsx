import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Free Turf Cleaning Quote Melbourne",
  description:
    "Get a free turf cleaning quote in minutes. Call 0433 240 617. Based in Bonnie Brook, servicing all Melbourne suburbs Monday–Friday 8am–4pm.",
  openGraph: {
    title: "Contact Turf Clean Pros | Free Quote Melbourne",
    description:
      "Get a free turf cleaning quote in minutes. Call 0433 240 617. Based in Bonnie Brook, servicing all Melbourne suburbs.",
    url: "https://www.turfcleanpros.com.au/contact",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
