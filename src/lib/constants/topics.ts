export interface CuratedTopic {
  id: string;
  category: "Technology" | "Economy & Business" | "Social Issues" | "Ethics & Policy";
  title: string;
  description: string;
}

export const CURATED_TOPICS: CuratedTopic[] = [
  {
    id: "ai-workforce",
    category: "Technology",
    title: "Will Generative AI Replace Entry-Level Software Engineers or Elevate Them?",
    description: "Debate the shift from syntax writing to system architecture vs displacement of junior developers.",
  },
  {
    id: "moonlighting",
    category: "Economy & Business",
    title: "Moonlighting and Remote Work: Ethical Imperative or Breach of Employment Contract?",
    description: "Explore developer autonomy, IP rights, non-compete clauses, and changing workplace norms.",
  },
  {
    id: "ev-transition",
    category: "Economy & Business",
    title: "Electric Vehicles in Emerging Markets: Infrastructure Bottleneck vs Environmental Urgency",
    description: "Analyze grid capacity, battery mineral supply chain, government subsidies, and adoption hurdles.",
  },
  {
    id: "social-media-regulation",
    category: "Ethics & Policy",
    title: "Should Governments Mandate Strict Age Verification and Usage Caps on Social Media Platforms?",
    description: "Weigh child mental health protection and data privacy against state surveillance and digital rights.",
  },
  {
    id: "gig-economy",
    category: "Social Issues",
    title: "Gig Economy: Freedom of Independent Contracting vs Systematic Erosion of Worker Safety Nets",
    description: "Discuss minimum wage standards, health benefits, platform algorithmic control, and market flexibility.",
  },
  {
    id: "cashless-society",
    category: "Economy & Business",
    title: "The Transition to a 100% Digital Economy: Financial Inclusion or Digital Exclusion?",
    description: "Examine fintech convenience and fraud prevention vs cybersecurity risks and unbanked populations.",
  },
];
