# **App Name**: CyberPortfolio

## Core Features:

- Dynamic Content Management: Manage all website content (hero text, about section, skills, work experience, projects, testimonials) via Firebase Firestore.
- Animated Hero Section: Display Russell Mutamba's name and title with an animated intro text effect and a dynamic terminal/cyber grid background using Three.js.
- Interactive Skills Showcase: Present skills and technologies using neon cards with hover animations.
- Animated Work Experience Timeline: Showcase work experience using a modern timeline with animated entries, populated from Firestore.
- Project Showcase with Quicklinks: Display projects using animated cards with project name, description, tech used, thumbnail, and links to live demo and GitHub, data sourced from Firestore.
- Testimonial Carousel: Showcase testimonials in an animated carousel (cards fade in), using data from Firestore, and using Gemini to choose an appropriate tone for re-writing them if needed. Gemini is used as a tool here, not to create them entirely.
- Contact Form with Firestore Integration: Implement a contact form that saves submissions to Firebase Firestore and displays a success animation upon submission.

## Style Guidelines:

- Primary color: Electric Purple (#BE29EC) to capture the cyber-tech aesthetic with a vibrant and energetic feel.
- Background color: Dark grey (#212121) for a dark, terminal-like appearance. 
- Accent color: Neon Green (#39FF14) used for highlights and interactive elements to provide contrast and visual interest.
- Body and headline font: 'Space Grotesk', a proportional sans-serif font, suitable for headlines and short amounts of body text. If longer text is needed, use for headlines and 'Inter' for body text. 
- Use modern neon icons for skills and technologies.
- Utilize a single-page layout with smooth scrolling and parallax effects.
- Implement GSAP animations for intro text, timeline entries, and card hover effects. Also incorporate CSS animations and 3D micro-interactions for a premium feel.