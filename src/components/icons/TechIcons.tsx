'use client';
import React from 'react';
import {
  FaAws,
  FaDocker,
  FaNodeJs,
  FaJava,
  FaPython,
  FaHtml5,
  FaCss3,
  FaAngular,
  FaGitAlt,
  FaFigma,
  FaReact,
  FaVuejs,
} from 'react-icons/fa';
import {
  SiTypescript,
  SiNextdotjs,
  SiThreedotjs,
  SiPostgresql,
  SiFirebase,
  SiTailwindcss,
  SiJavascript,
  SiSvelte,
} from 'react-icons/si';
import { PanelTop } from 'lucide-react';

export const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  typescript: SiTypescript,
  react: FaReact,
  nextjs: SiNextdotjs,
  threejs: SiThreedotjs,
  aws: FaAws,
  docker: FaDocker,
  nodejs: FaNodeJs,
  postgresql: SiPostgresql,
  firebase: SiFirebase,
  tailwind: SiTailwindcss,
  java: FaJava,
  python: FaPython,
  javascript: SiJavascript,
  html5: FaHtml5,
  css3: FaCss3,
  svelte: SiSvelte,
  vue: FaVuejs,
  angular: FaAngular,
  git: FaGitAlt,
  figma: FaFigma,
  designtool: PanelTop,
};

export const TechIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};
