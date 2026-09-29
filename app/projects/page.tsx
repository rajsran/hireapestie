import type { Metadata } from "next";
import ProjectsClient from './ProjectsClient';

export const metadata: Metadata = {
  title: "Projects | Real Turf Cleaning Jobs Across Melbourne",
  description:
    "Browse real turf cleaning and bird proofing jobs completed by Turf Clean Pros across Melbourne suburbs. See the quality of our work before you book.",
  keywords: [
    "turf cleaning projects Melbourne",
    "synthetic turf cleaning before after Melbourne",
    "turf cleaning results Melbourne",
    "residential turf cleaning jobs Melbourne",
    "commercial turf cleaning portfolio",
  ],
  openGraph: {
    title: "Our Projects | Real Turf Cleaning Jobs Melbourne",
    description:
      "Real turf cleaning jobs completed across Melbourne. See our work before you book — residential and commercial.",
    url: "https://www.turfcleanpros.com.au/projects",
  },
  alternates: { canonical: "https://www.turfcleanpros.com.au/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-20">
      <ProjectsClient />
    </div>
  );
}
