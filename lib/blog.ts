export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readMinutes: number;
  category: string;
  image?: string; // photo in /public; if omitted a branded graphic cover is shown
  imagePosition?: string; // CSS object-position for the cover crop, e.g. "center 25%"
  icon?: "snowflake" | "calendar" | "bug" | "paw" | "home" | "search";
  content: Block[];
}

// Posts are sorted newest-first automatically. `image` (optional) must exist in /public.
const allPosts: Post[] = [
  {
    slug: "winter-pests-cold-weather",
    title: "Winter Pests: Do You Really Need Pest Control in Cold Weather?",
    excerpt: "Many people assume that pest problems disappear in winter, but the cold often drives pests straight into your home.",
    date: "2025-02-24",
    readMinutes: 3,
    category: "Seasonal",
    image: "/blog-winter-pests.jpg",
    content: [
      { type: "p", text: "Many people assume that pest problems disappear in winter. In reality, the cold often pushes pests indoors in search of warmth, food and shelter — which can make winter one of the busiest times for household infestations." },
      { type: "h2", text: "Which pests are active in cold weather?" },
      { type: "ul", items: [
        "Rodents, which move into roof voids, walls and garages to escape the cold.",
        "Cockroaches, which thrive in warm, humid spots like kitchens and bathrooms.",
        "Spiders, which follow the insects that move indoors.",
        "Ants, which can nest in wall cavities and under floors.",
      ] },
      { type: "h2", text: "Why winter prevention pays off" },
      { type: "p", text: "Pests that settle in over winter can be well established by spring. Dealing with them early is simpler, and helps stop the problem growing as the weather warms up." },
      { type: "h2", text: "What you can do" },
      { type: "ul", items: [
        "Seal gaps around doors, pipes and windows.",
        "Store food in sealed containers and keep the kitchen tidy.",
        "Declutter garages, sheds and roof spaces where pests like to hide.",
        "Book a pest inspection to catch any problems early.",
      ] },
      { type: "p", text: "If you've noticed droppings, noises in the walls or insects indoors, don't wait for warmer weather. Get in touch for a free, no-obligation quote." },
    ],
  },
  {
    slug: "best-time-for-pest-control",
    title: "Best Time to Use Pestie for Maximum Protection",
    excerpt: "Pest control timing is crucial for achieving the best results. Here's when to book for maximum protection.",
    date: "2025-02-24",
    readMinutes: 3,
    category: "Pest control tips",
    image: "/blog-best-time.jpg",
    imagePosition: "center 25%",
    content: [
      { type: "p", text: "Pest control timing is crucial for achieving the best results. The honest answer is that the best time is before a small problem becomes a big one — but a few moments in the year are especially worthwhile." },
      { type: "h2", text: "Good times to book" },
      { type: "ul", items: [
        "At the first sign of pests — droppings, bites, chewed packaging or regular insect sightings.",
        "Before and during construction, with pre-construction termite protection once the concrete preparation is finished.",
        "Before the warmer months, when pests such as mosquitoes and ants become more active.",
        "When the weather turns cold, as pests move indoors looking for warmth.",
        "Before buying or selling a property, with a pest inspection for peace of mind.",
      ] },
      { type: "h2", text: "Regular visits beat one-off fixes" },
      { type: "p", text: "A regular inspection or maintenance program helps you stay ahead of pests rather than reacting to them. For businesses such as restaurants, cafes and hotels, a scheduled program is especially valuable." },
      { type: "h2", text: "Not sure when to book?" },
      { type: "p", text: "Call us or request a free quote and we'll recommend the right timing for your property and the pests you're dealing with. We offer 24/7 availability and will work around your schedule." },
    ],
  },
  {
    slug: "mosquito-control-keep-your-yard-bug-free",
    title: "Mosquito Control: Can Pestie Help Keep Your Yard Bug-Free?",
    excerpt: "Mosquitoes can quickly turn a relaxing outdoor space into an uncomfortable one. Here's how to fight back.",
    date: "2025-02-24",
    readMinutes: 3,
    category: "Outdoor pests",
    image: "/blog-mosquito-control.jpg",
    content: [
      { type: "p", text: "Mosquitoes can quickly turn a relaxing outdoor space into an uncomfortable one. The good news is that a combination of good habits and professional help can make a big difference." },
      { type: "h2", text: "Start by removing breeding spots" },
      { type: "p", text: "Mosquitoes breed in standing water, so the first step is to get rid of it:" },
      { type: "ul", items: [
        "Empty pot-plant saucers, buckets, toys and tarps after rain.",
        "Clear blocked gutters and drains.",
        "Change water in bird baths and pet bowls regularly.",
        "Keep pools and ponds maintained.",
      ] },
      { type: "h2", text: "Tidy the garden" },
      { type: "p", text: "Adult mosquitoes rest in shady, damp spots. Trim overgrown shrubs and long grass, particularly near entertaining areas and doors." },
      { type: "h2", text: "How a professional can help" },
      { type: "p", text: "Our seasoned residential pest control team is ready to help you ward off mosquitoes and other pests effectively. We tailor the approach to your property, whether it's a townhouse, a house or a large estate, and use eco-friendly methods." },
      { type: "p", text: "Ready to enjoy your yard again? Request a free quote today." },
    ],
  },
  {
    slug: "fleas-ticks-and-other-pet-pests",
    title: "Fleas, Ticks, and Other Pet Pests: Does Pestie Help?",
    excerpt: "Pets bring joy, companionship, and love into our lives, but they can also bring unwanted guests home with them.",
    date: "2025-02-21",
    readMinutes: 4,
    category: "Pets & pests",
    image: "/blog-pet-pests.jpg",
    content: [
      { type: "p", text: "Pets bring joy, companionship and love into our lives, but they can also bring unwanted guests home. Fleas and ticks are the usual suspects — and once they're in your home or yard, treating the pet alone often isn't enough." },
      { type: "h2", text: "Signs of fleas and ticks" },
      { type: "ul", items: [
        "Your pet scratching or chewing more than usual.",
        "Small dark specks (flea dirt) in your pet's coat or bedding.",
        "Bites on you or your family, especially around the ankles.",
        "Ticks attached to your pet's skin after time outdoors.",
      ] },
      { type: "h2", text: "A two-part approach" },
      { type: "p", text: "Talk to your vet about the right flea and tick treatment for your pet. At the same time, the home and yard need attention, because eggs and larvae live in carpets, bedding and garden areas, not only on your pet." },
      { type: "h2", text: "How we can help" },
      { type: "p", text: "Our technicians inspect your property to identify where the problem is coming from, then treat the home and surrounds using eco-friendly methods. We'll explain any simple precautions for your household and pets before we start." },
      { type: "h2", text: "Keep it from happening again" },
      { type: "ul", items: [
        "Wash pet bedding regularly and vacuum often.",
        "Keep grass trimmed and clear leaf litter.",
        "Stick to your vet's preventative treatment schedule.",
      ] },
    ],
  },
  {
    slug: "pre-construction-termite-protection",
    title: "Why Pre-construction Pest Control Matters Before You Build",
    excerpt:
      "Termite protection is easiest and most effective before your home is finished. Here's what pre-construction pest control involves and when it happens.",
    date: "2026-11-20",
    readMinutes: 3,
    category: "Pre-construction",
    image: "/service-preconstruction.jpg",
    content: [
      { type: "p", text: "Building a new home is exciting — and the best time to protect it from termites is before it's finished. Pre-construction pest control is a preventative treatment carried out during the build, once the concrete preparation has been finished." },
      { type: "h2", text: "What does it involve?" },
      { type: "p", text: "A pre-construction treatment establishes both a physical and a chemical defence system around the building. Together, they discourage termites from infiltrating your home for years to come." },
      { type: "h2", text: "Why do it during construction?" },
      { type: "ul", items: [
        "The soil and slab edges are exposed, so treatment can be applied thoroughly.",
        "It is far easier than trying to retrofit protection to a finished home.",
        "It protects your biggest investment from the very start.",
      ] },
      { type: "h2", text: "Next steps" },
      { type: "p", text: "If you're building, talk to your builder about timing and get in touch with us early. We'll explain the process and give you a free, no-obligation quote." },
    ],
  },
  {
    slug: "signs-you-need-a-pest-inspection",
    title: "5 Signs It's Time for a Pest Inspection",
    excerpt:
      "Pests rarely announce themselves. These warning signs mean it's time to have a professional take a look at your property.",
    date: "2026-11-12",
    readMinutes: 3,
    category: "Inspections",
    image: "/service-inspection.jpg",
    content: [
      { type: "p", text: "Pests are like guests who overstay their welcome — and the longer they stay, the harder they are to move. Catching a problem early makes treatment simpler and helps prevent damage." },
      { type: "h2", text: "Warning signs to look for" },
      { type: "ul", items: [
        "Droppings, or small dark specks in cupboards, drawers and along skirting boards.",
        "Gnaw marks on food packaging, wiring or timber.",
        "Noises in the walls or roof void, especially at night.",
        "Mud trails, or damaged and hollow-sounding timber.",
        "Unexplained bites, or live insects appearing regularly in the same spot.",
      ] },
      { type: "h2", text: "What happens in an inspection?" },
      { type: "p", text: "Our technicians inspect your property, identifying potential pest threats and vulnerabilities, and then explain what they've found and what to do next. It's also a great idea before buying or selling a property, or whenever you want peace of mind." },
    ],
  },
  {
    slug: "pest-proofing-your-home",
    title: "Simple Ways to Pest-Proof Your Home",
    excerpt:
      "A few small habits can make your home far less inviting to ants, cockroaches, rodents and mosquitoes.",
    date: "2026-11-05",
    readMinutes: 4,
    category: "Home tips",
    image: "/service-residential.jpg",
    content: [
      { type: "p", text: "Your home should be your sanctuary, not a playground for pests. Prevention is the easiest way to keep it that way, and most of it comes down to removing what pests are looking for: food, water and shelter." },
      { type: "h2", text: "Cut off food and water" },
      { type: "ul", items: [
        "Store food in sealed containers and wipe up crumbs and spills promptly.",
        "Take out rubbish regularly and keep bins closed.",
        "Fix leaking taps and pipes, and don't leave pet water or food out overnight.",
      ] },
      { type: "h2", text: "Close the gaps" },
      { type: "ul", items: [
        "Seal cracks around doors, windows and pipes.",
        "Check door seals and screens for gaps.",
        "Trim vegetation away from walls and the roofline.",
      ] },
      { type: "h2", text: "Reduce mosquito breeding" },
      { type: "p", text: "Empty anything that holds standing water, such as pot-plant saucers, buckets and clogged gutters." },
      { type: "h2", text: "When to call a professional" },
      { type: "p", text: "If pests keep coming back despite your best efforts, it's time for expert help. Our team offers tailored, eco-friendly solutions for homes of every kind, and we focus on prevention so pests don't return." },
    ],
  },
  {
    slug: "pest-control-for-restaurants-and-cafes",
    title: "Pest Control for Restaurants, Cafes and Other Businesses",
    excerpt:
      "A single pest sighting can hurt your reputation. Here's why regular pest management is part of running a clean, compliant business.",
    date: "2026-10-28",
    readMinutes: 3,
    category: "Commercial",
    image: "/service-commercial.jpg",
    content: [
      { type: "p", text: "For a business, pests are more than a nuisance — they can damage stock, upset customers and harm your reputation. Nobody wants a cockroach turning up at a client meeting, or in the kitchen." },
      { type: "h2", text: "Who needs commercial pest control?" },
      { type: "p", text: "Restaurants, cafes, factories, shopping malls, offices, petrol stations, hotels, motels, airports and many other businesses all benefit from a regular pest management program." },
      { type: "h2", text: "What a good program includes" },
      { type: "ul", items: [
        "An initial inspection to find risks and weak points.",
        "A maintenance program tailored to your type of business.",
        "Clear advice for your team on hygiene and prevention.",
        "Flexible scheduling so your operations aren't disrupted.",
      ] },
      { type: "p", text: "Our commercial services are available at competitive, budget-friendly rates. Contact us for a free quote." },
    ],
  },
];

export const posts: Post[] = [...allPosts].sort((a, b) => b.date.localeCompare(a.date));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}
