# TanStack Start + Clerk + Supabase Starter

A modern full-stack web application template built with TanStack Start, featuring Clerk authentication, Supabase database, Prisma ORM, Redux Toolkit, React Query, and React Server Components.

## Features

- **Authentication**: Integrated Clerk authentication with user management
- **Database**: Supabase PostgreSQL database with Prisma ORM
- **State Management**: 
  - Redux Toolkit for global state
  - React Query for server state
- **UI and Styling**: 
  - Tailwind CSS for responsive design
  - React Hot Toast for notifications
- **Modern React Practices**:
  - React Server Components (RSC) for optimized rendering
  - Type-safe APIs with TanStack Server Functions
- **Demonstration Pages**:
  - Todo List (CRUD operations with Prisma & Supabase)
  - Notes (React Server Components example)
  - Counter (Redux state management example)
  - Posts (React Query data fetching)
  - User Profile (Clerk integration)

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or pnpm

### Environment Setup

1. Create a `.env` file with your Clerk and Supabase credentials:

```
# Clerk
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Database for Prisma
DATABASE_URL=your_postgres_connection_string
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start the development server
npm run dev
```

The app will be available at http://localhost:3000.

## Project Structure

```
/
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── src/
    ├── components/       # Reusable UI components
    ├── routes/           # File-based routing
    │   ├── __root.tsx    # Root layout
    │   ├── _authed/      # Protected routes
    │   └── index.tsx     # Home page
    ├── store/            # Redux store configuration
    │   └── slices/       # Redux slices
    ├── styles/           # Global styles
    └── utils/            # Utility functions and API calls
```

## Development Tools

- **Prisma Studio**: Run `npm run prisma:studio` to open a browser interface for your database
- **TanStack Router Dev Tools**: Accessible in the app for debugging routes
- **React Query Dev Tools**: Integrated for monitoring data fetching

## License

MIT