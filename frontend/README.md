# Frontend - FarmCare AI

This directory contains all client-side code and user interface components for the FarmCare AI application.

## Structure

```
frontend/
├── src/                          # Source code
│   ├── components/              # Reusable React components
│   ├── pages/                   # Page components (routes)
│   ├── store/                   # State management (Zustand)
│   ├── lib/                     # External service integrations
│   ├── types/                   # TypeScript type definitions
│   └── ai/                      # AI-related utilities and services
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   └── videoplayback.mp4        # Video assets
├── package.json                 # Node.js dependencies and scripts
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── index.html                  # Main HTML template
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Zustand** - State management
- **Firebase** - Authentication and database
- **Lucide React** - Icon library

## Files Description

### Configuration Files
- **package.json**: Node.js project configuration and dependencies
- **vite.config.ts**: Vite bundler configuration
- **tailwind.config.js**: Tailwind CSS customization
- **tsconfig.json**: TypeScript compiler configuration
- **eslint.config.js**: ESLint linting rules
- **postcss.config.js**: PostCSS configuration

### Source Code Structure
- **src/components/**: Reusable UI components and layouts
- **src/pages/**: Main page components (HomePage, Dashboard, SignIn, etc.)
- **src/store/**: Global state management using Zustand
- **src/lib/**: External service integrations (Firebase, Supabase, Cloudinary)
- **src/types/**: TypeScript type definitions
- **src/ai/**: AI-related services and utilities

### Static Assets
- **public/images/**: Logo, icons, and other image assets
- **public/videoplayback.mp4**: Hero section background video
- **index.html**: Main HTML template and entry point
