export interface HeroData {
  name: string;
  subtitle: string;
}

export interface AboutData {
  paragraph: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  name:string;
  description: string;
  tech: string[];
  imageUrl: string;
  imageHint: string;
  liveUrl: string;
  githubUrl: string;
}

export interface Testimonial {
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
