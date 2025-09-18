# Solar Panel CRM System

## Overview

This is a comprehensive CRM (Customer Relationship Management) web application specifically designed for medium-sized solar panel sales companies. The system provides a complete sales pipeline management solution with lead tracking, marketing campaign automation, communication management, and business analytics.

The application follows a modern full-stack architecture with a React frontend using TypeScript and Tailwind CSS, an Express.js backend with PostgreSQL database, and includes features for email/SMS integration, role-based access control, and comprehensive reporting capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, professional design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling for accessibility and consistency
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations and schema management
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **API Design**: RESTful endpoints with consistent error handling and validation using Zod schemas

### Database Design
- **Database**: PostgreSQL with connection pooling via Neon serverless
- **Schema Management**: Drizzle Kit for migrations and schema versioning
- **Core Entities**:
  - Users (admin, sales, marketing, support roles)
  - Leads (with status pipeline: new → contacted → proposal → closed)
  - Campaigns (email marketing with tracking metrics)
  - Communications (emails, calls, meetings, notes)
- **Data Relationships**: Proper foreign key constraints and relational design for data integrity

### Component Architecture
- **Design System**: Modified Material Design optimized for B2B productivity
- **Color Palette**: Professional blue/gold theme with light/dark mode support
- **Layout System**: Consistent spacing using Tailwind's 8-point grid system
- **Navigation**: Fixed sidebar with collapsible sections and breadcrumb navigation
- **Data Display**: Advanced tables with sorting/filtering, pipeline visualization cards, and performance dashboards

### Business Logic
- **Pipeline Management**: Lead progression through defined sales stages with probability tracking
- **Campaign Analytics**: Open rates, click-through rates, and conversion tracking
- **Communication Hub**: Centralized activity timeline with template management
- **Reporting**: KPI dashboards with exportable reports (CSV, PDF)

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL serverless database for scalable data storage
- **Email Service**: SendGrid API integration for transactional emails and marketing campaigns
- **SMS Service**: Twilio API integration for SMS communications and notifications

### Development Tools
- **Package Manager**: npm with package-lock.json for dependency management
- **Code Quality**: ESLint and Prettier configuration for consistent code formatting
- **Type Checking**: TypeScript strict mode for compile-time error detection
- **Build Process**: Vite with esbuild for fast compilation and bundling

### UI/UX Libraries
- **Component Library**: Radix UI for accessible, unstyled component primitives
- **Styling**: Tailwind CSS with PostCSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Data Fetching**: TanStack Query for efficient server state management and caching

### Authentication & Security
- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage
- **Input Validation**: Zod schemas for runtime type checking and data validation

### Utility Libraries
- **Date Handling**: date-fns for date manipulation and formatting
- **Class Management**: clsx and class-variance-authority for conditional styling
- **UUID Generation**: Built-in PostgreSQL UUID generation for unique identifiers