import ProjectsClient from './ProjectsClient';

export const metadata = {
  title: "Projects | Real Turf Cleaning Jobs Across Melbourne",
  description:
    "Browse real turf cleaning and bird proofing jobs completed by Turf Clean Pros across Melbourne suburbs. See the quality of our work before you book.",
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
