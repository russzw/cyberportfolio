import { Timestamp } from "firebase/firestore";

export interface HeroData {
  name: string;
  subtitle: string;
}

export interface AboutData {
  paragraph: string;
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  startDate: Timestamp | Date;
  endDate?: Timestamp | Date;
  description: string;
}

export interface Project {
  id: string;
  name:string;
  description: string;
  tech: string[];
  imageUrl: string;
  imageHint: string;
  liveUrl: string;
  githubUrl: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  text: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  skills: Skill[];
  experience: ExperienceItem[];
  projects: Project[];
  testimonials: Testimonial[];
}