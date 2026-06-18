import type { NavItem } from "@/lib/types";

export const site = {
  name: "WORLD CUP 2026",
  tagline: "Match Center",
  description:
    "Live scores, featured fixtures, AI match predictions and full tournament standings for World Cup 2026 — the ultimate fan match center.",
  nav: [
    { label: "News", href: "/news" },
    { label: "Fixtures", href: "/fixtures" },
    { label: "Results", href: "/results" },
    { label: "Predictions", href: "/#predictions" },
    { label: "Standings", href: "/standings" },
  ] satisfies NavItem[],
  hero: {
    eyebrow: "The world's biggest stage",
    titleLead: "WORLD CUP 2026",
    titleAccent: "MATCH CENTER",
    subtitle:
      "Real-time scores, in-depth analysis and predictions — everything you need for the ultimate World Cup experience.",
    stats: [
      { value: "48", label: "Teams" },
      { value: "104", label: "Matches" },
      { value: "16", label: "Host Cities" },
    ],
  },
  cta: {
    eyebrow: "Don't miss a moment",
    title: "Unlock exclusive match insights",
    subtitle:
      "Get expert analysis, premium predictions and live alerts delivered straight to your feed.",
    button: "Get Started",
    href: "/news",
    features: [
      "Expert match analysis",
      "Real-time insights",
      "Live score alerts",
    ],
  },
  footer: {
    columns: [
      {
        title: "Tournament",
        links: ["Fixtures", "Results", "Groups", "Knockouts"],
      },
      {
        title: "Explore",
        links: ["Teams", "Players", "Venues", "News"],
      },
      {
        title: "Company",
        links: ["About", "Contact", "Privacy Policy", "Terms"],
      },
    ],
    socials: ["twitter", "instagram", "youtube", "facebook"] as const,
  },
};
