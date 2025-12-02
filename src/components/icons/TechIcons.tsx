import React from 'react';

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  typescript: (props) => (
    <svg {...props} viewBox="0 0 128 128">
      <path fill="#007ACC" d="M0 0h128v128H0z" />
      <path fill="#FFF" d="M22.1 22.1h83.7v83.7H22.1z" />
      <path fill="#007ACC" d="M30.4 30.4h67.2v67.2H30.4z" />
      <path fill="#FFF" d="M57.9 83.1c1.8 1.4 4.1 2.3 6.9 2.3 3.5 0 6-1.4 6-4.2 0-2.4-1.5-3.5-5.2-4.9l-3.2-1.2c-5.5-2.1-9.2-5-9.2-11.4 0-5.8 4.3-10.2 11.2-10.2 4.1 0 7.3 1.3 9.7 3.2l-3.4 5.3c-1.4-1-3-1.8-5.7-1.8-2.6 0-4.4 1.2-4.4 3.4 0 2.4 1.6 3.3 4.8 4.6l3.2 1.2c6.7 2.5 10 5.6 10 12.1 0 6.9-5.1 11.2-13.3 11.2-5.1 0-9.2-1.8-12.1-4.3l3.8-5.6zM95.6 53.4h-7.8V46h-6.8v7.4h-5.2v6.2h5.2v20.1c0 5.9 2.7 8.4 9.4 8.4.5 0 1-.1 1.6-.1v-6.1c-.5.1-1 .1-1.5.1-2.5 0-3.5-1-3.5-4.2V59.6h5v-6.2z"/>
    </svg>
  ),
  react: (props) => (
    <svg {...props} viewBox="-11.5 -10.23174 23 20.46348">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB"/>
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  ),
  threejs: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  aws: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.295 2.73a.548.548 0 00-.584.004l-8.03 4.653c-.2.115-.31.32-.31.54V16.07c0 .22.11.425.31.54l8.03 4.654a.543.543 0 00.584.003l8.03-4.653c.2-.115.31-.32.31-.54V7.928c0-.22-.11-.425-.31-.54L13.295 2.73zM12.91 4.31l6.44 3.73-2.66 1.54-6.44-3.73 2.66-1.54zm-1.16 0l2.66 1.54-6.44 3.73-2.66-1.54 6.44-3.73zM4.78 8.61l6.63 3.84v7.62l-6.63-3.84V8.61zm14.44 7.79l-6.63 3.84V12.45l6.63-3.84v7.79z"/>
    </svg>
  ),
  docker: (props) => (
     <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.12 6.54c-1.5-3.3-4.5-5.4-8.12-5.4-2.58 0-5.4.8-7.25 2.4-1.28 1.1-2.28 2.5-2.69 4.2H22.12zM4.06 9.24H.08v1.6h3.98zM9.44 9.24H5.25v1.6h4.19zM14.73 9.24h-4.09v1.6h4.09zM20.12 9.24h-4.19v1.6h4.19zM.08 11.94h2.79v1.6H.08zM.11 19.34c3.4 2.8 8.1 3.2 12 1.3 1.8-.9 3.4-2.4 4.4-4.2.9-1.5 1.2-3.2 1.2-4.9H.11v7.8zm14.7-5.7h-2.99v1.6h2.99zm-4.39 0H7.43v1.6h2.99zm-4.29 0H3.14v1.6h2.99z"/>
    </svg>
  ),
  nodejs: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.75 1.52l-9 5.25A2.25 2.25 0 002 8.66v6.68c0 .9.57 1.7 1.43 2.09l9 5.25c.78.45 1.76.45 2.54 0l9-5.25c.86-.4 1.43-1.19 1.43-2.09V8.66c0-.9-.57-1.7-1.43-2.09l-9-5.25a2.58 2.58 0 00-2.54 0zm.2 1.73c.26.15.26.15 0 0zm-.18 17.5l-9-5.25a.75.75 0 01-.43-.64V8.66a.75.75 0 01.43-.64l9-5.25c.26-.15.55-.15.81 0l9 5.25c.26.15.43.4.43.64v6.68c0 .24-.17.49-.43.64l-9 5.25c-.26.15-.55.15-.81 0z"/>
      <path d="M10.15 8.03a.75.75 0 00-1.3-.75L6.3 11.5v1l2.55-1.5v4.25a.75.75 0 001.5 0V9.75l-.2-.22zM14.6 15.3l-2.7-1.7v-1.6l2.7-1.6a.75.75 0 00.75-1.3L12.9 7.6a.75.75 0 00-1.3.75v3.15l-1.35.8v-1.7l1.35-.8V6.65a.75.75 0 10-1.5 0v3.25L7.6 11.5v1l2.55-1.5v1.7L7.6 14.3v1l2.55-1.5 1.35.8v3.15a.75.75 0 101.5 0v-3.25l2.55-1.5a.75.75 0 000-1.3z"/>
    </svg>
  ),
  postgresql: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.91h-2V12c0-1.1.9-2 2-2h2v2h-2v4.91zm4-6.91v4h2v2h-2v2h-2v-2h-2v-2h2v-2c0-1.1.9-2 2-2h2v2h-2z"/>
    </svg>
  ),
  designtool: (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h.01"/><path d="M10 12v.01"/><path d="M14 12v.01"/><path d="M12 12v.01"/><path d="M12 8v.01"/><path d="M3 3h18v18H3z"/>
    </svg>
  ),
}

export const TechIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};
