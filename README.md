# Next.js & Firebase Portfolio Starter

This is a portfolio website starter kit built with Next.js, Firebase, Genkit, and Tailwind CSS, all managed within Firebase Studio. It features a full-stack setup with a content management system (CMS) for easy updates.

## ✨ Features

- **Modern Tech Stack**: Built with Next.js App Router, React Server Components, and TypeScript.
- **Styling**: Styled with Tailwind CSS and ShadCN UI components for a professional and customizable look.
- **Firebase Integration**: Uses Firebase for authentication, Firestore database, and hosting.
- **AI-Ready**: Integrated with Genkit for generative AI capabilities.
- **Admin Dashboard**: A secure admin panel to manage all portfolio content, including projects, skills, experience, and testimonials.
- **Dynamic Content & Automatic Seeding**: Fetches content from Firestore. If the database is empty, it automatically populates itself with sample data from a local JSON file, allowing you to get started immediately.

## 🚀 Getting Started

To get the development server running (with Turbopack for speed):

```bash
npm run dev
```

This will start the Next.js application on `http://localhost:9002`.

### Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server.
- `npm run lint`: Lints the codebase for errors.

## 📁 Project Structure

Here's a quick overview of the key directories:

- `src/app/`: The core of the Next.js application, using the App Router.
  - `(main)/`: The main layout and pages for the public-facing portfolio.
  - `admin/`: The admin dashboard for content management.
- `src/components/`: Reusable React components.
  - `sections/`: Components for each section of the portfolio (Hero, About, etc.).
  - `admin/`: Components used in the admin dashboard.
  - `ui/`: ShadCN UI components.
- `src/firebase/`: Firebase configuration and custom hooks.
- `src/lib/`: Utility functions, type definitions, and data fetching logic.
- `src/ai/`: Contains Genkit flows for AI-powered features.
- `docs/`: Contains backend configuration and schema definitions.
- `public/`: Static assets like images and fonts.
- `sample-data.json`: Contains the initial content used to seed the database.

## 🔑 Admin Panel

You can access the admin panel by navigating to `/admin`.

- **Authentication**: The admin panel is protected by Firebase Authentication.
- **Automatic Content Seeding**: On first run, the app will automatically populate the Firestore database with the content from `sample-data.json`. You can then edit this content directly in the admin panel.

To grant admin access to a user:
1. Go to your Firebase Console.
2. Navigate to the Firestore Database.
3. Create a collection named `roles_admin`.
4. Add a new document with the Document ID set to the user's UID (you can find this in the Firebase Authentication section).
5. Add a field to the document, such as `isAdmin: true`.

The existence of this document is what grants a user administrative rights.
