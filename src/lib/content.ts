import profileJson from "@content/profile.json";
import projectsJson from "@content/projects.json";
import experienceJson from "@content/experience.json";
import stackJson from "@content/stack.json";
import certificationsJson from "@content/certifications.json";
import recommendationsJson from "@content/recommendations.json";
import affiliationsJson from "@content/affiliations.json";
import gearJson from "@content/gear.json";

export interface Social {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  displayName: string;
  role: string;
  location: string;
  status: string;
  bio: string;
  photo: string;
  resume: string;
  email: string;
  socials: Social[];
}

export interface ItemLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  status: string;
  featured: boolean;
  tags: string[];
  links: ItemLink[];
  summary: string;
  body: string[];
  highlights: string[];
}

export interface Experience {
  slug: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  tags: string[];
  summary: string;
  body: string[];
  highlights: string[];
}

export interface Certification {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  url: string;
  tags: string[];
  summary: string;
  body: string[];
  /** Optional issuer logo. Paste an image path from /public (e.g. "/images/certs/cisco-networking-academy.png") or a full URL. Leave out to show no logo. */
  logo?: string;
}

export interface Recommendation {
  slug: string;
  name: string;
  role: string;
  relation: string;
  date: string;
  quote: string;
  body: string[];
}

export interface Affiliation {
  slug: string;
  org: string;
  role: string;
  start: string;
  end: string;
  url: string;
  summary: string;
  body: string[];
}

export interface StackItem {
  name: string;
  note?: string;
}

export interface StackCategory {
  name: string;
  items: StackItem[];
}

export interface GearSection {
  name: string;
  items: StackItem[];
}

export const profile: Profile = profileJson;
export const projects: Project[] = projectsJson;
export const experience: Experience[] = experienceJson;
export const stackCategories: StackCategory[] = stackJson.categories;
export const certifications: Certification[] = certificationsJson;
export const recommendations: Recommendation[] = recommendationsJson;
export const affiliations: Affiliation[] = affiliationsJson;
export const gearSections: GearSection[] = gearJson.sections;

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const getExperience = (slug: string) =>
  experience.find((e) => e.slug === slug);
export const getCertification = (slug: string) =>
  certifications.find((c) => c.slug === slug);
export const getRecommendation = (slug: string) =>
  recommendations.find((r) => r.slug === slug);
export const getAffiliation = (slug: string) =>
  affiliations.find((a) => a.slug === slug);
