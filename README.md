# 🛡️ Guard Pro

<div align="center">

**A comprehensive security guard management system for managing companies, sites, employees, shifts, attendance, incidents, and payroll.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)](https://flutter.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## 📖 About Guard Pro

**Guard Pro** is a full-stack security guard management platform designed to streamline operations for security companies. The system provides comprehensive tools for managing multiple companies, sites, employees, shifts, attendance tracking, incident reporting, and payroll management.

### Key Capabilities

- **Multi-Company Management**: Manage multiple security companies from a single platform
- **Site Management**: Track and manage client sites with detailed information and photos
- **Employee Management**: Complete employee lifecycle management with roles and status tracking
- **Shift Scheduling**: Create and manage recurring and one-time shifts with flexible scheduling
- **Attendance Tracking**: Monitor employee attendance with heatmap visualization
- **Incident Reporting**: Record and track security incidents at sites
- **Payroll Management**: Generate and manage payrolls for employees and companies
- **Messaging System**: Internal messaging between administrators and employees
- **Mobile Application**: Native mobile apps for iOS and Android using Flutter

---

## 🚀 Getting Started

### Prerequisites

- **Bun** (v1.0+) - Package manager and runtime
- **Node.js** (v18+) - For development tools
- **PostgreSQL** - Database (via Supabase)
- **Flutter** (v3.8+) - For mobile app development (optional)
- **Supabase Account** - For backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd guard_pro
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Set up the database**
   ```bash
   # Generate migrations
   bun run db:generate
   
   # Run migrations
   bun run db:migrate
   
   # Or push schema directly
   bun run db:push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   ```

   The application will be available at `http://localhost:3000`

### Mobile App Setup

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install Flutter dependencies**
   ```bash
   flutter pub get
   ```

3. **Configure app icons**
   
   The app icons are already configured in `pubspec.yaml`:
   - iOS: `assets/ios.png`
   - Android: `assets/android-icon.png`
   - Android Adaptive: `assets/android-icon-background.png` & `assets/android-icon-foreground.png`

4. **Run the mobile app**
   ```bash
   flutter run
   ```

---

## 🛠️ Development Guide

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server on port 3000 |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run linter and type checking |
| `bun run format` | Format code using Biome |
| `bun run test` | Run test suite |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:push` | Push schema changes to database |
| `bun run db:studio` | Open Drizzle Studio |

### Tech Stack

#### Frontend (Web)
- **Framework**: React 19 with TanStack Start
- **Routing**: TanStack Router
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

#### Backend
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Storage**: Supabase Storage
- **API**: TanStack Start API routes

#### Mobile
- **Framework**: Flutter 3.8+
- **State Management**: Provider
- **Routing**: GoRouter
- **Backend**: Supabase Flutter SDK
- **UI**: Material Design with custom theming

### Project Structure

```
guard_pro/
├── src/                          # Web application source
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── dialogs/            # Dialog components
│   │   ├── sidebar/            # Sidebar navigation
│   │   └── ui/                 # Reusable UI components (shadcn)
│   ├── routes/                 # TanStack Router routes
│   │   ├── (auth)/            # Authentication routes
│   │   ├── dashboard/         # Dashboard routes
│   │   └── api/               # API routes
│   ├── db/                     # Database configuration
│   │   ├── schema.ts          # Drizzle schema definitions
│   │   └── index.ts           # Database connection
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts            # Auth configuration
│   │   └── auth-client.ts     # Client-side auth
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React context providers
│   ├── services/              # API service functions
│   ├── constants.ts           # Application constants
│   └── router.tsx             # Router configuration
├── mobile/                     # Flutter mobile application
│   ├── lib/                   # Dart source code
│   │   ├── pages/            # Screen pages
│   │   ├── providers/        # State providers
│   │   ├── router/           # Navigation router
│   │   └── theme/            # App theming
│   ├── assets/               # App assets (icons, images)
│   │   ├── ios.png          # iOS app icon
│   │   ├── android-icon.png # Android app icon
│   │   ├── android-icon-background.png
│   │   └── android-icon-foreground.png
│   └── pubspec.yaml          # Flutter dependencies
├── supabase/                  # Supabase configuration
│   ├── migrations/           # Database migrations
│   └── config.toml           # Supabase local config
├── public/                    # Static assets
├── package.json               # Node.js dependencies
├── vite.config.ts            # Vite configuration
├── drizzle.config.ts         # Drizzle configuration
└── tsconfig.json             # TypeScript configuration
```

### Important Files & Directories

#### Database Schema (`src/db/schema.ts`)
Contains all database table definitions using Drizzle ORM:
- **Auth Tables**: `user`, `session`, `account`, `verification`
- **Core Tables**: `company`, `site`, `employee`, `address`
- **Shift Tables**: `shift`, `shift_assignment`, `shiftExcludeDay`, `shiftIncludeDay`
- **Attendance**: `attendance` table
- **Incidents**: `incident` table
- **Payroll**: `payroll` table
- **Messaging**: `message` table

#### Router Configuration (`src/router.tsx`)
- Sets up TanStack Router with React Query integration
- Configures mutation cache for optimistic updates
- Handles toast notifications for mutations

#### Authentication (`src/lib/auth.ts`)
- Better Auth configuration
- Supports email/password and OAuth (Google, GitHub)
- Uses Drizzle adapter for database

#### Mobile App Icons (`mobile/assets/`)
- Icons are configured in `pubspec.yaml`
- Uses `flutter_launcher_icons` package
- Supports iOS and Android adaptive icons

### Code Style

- **Linter**: Biome
- **Formatter**: Biome
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky for pre-commit formatting

---

## ✨ Features

### ✅ Implemented Features

#### Authentication & User Management
- [x] Email/password authentication
- [x] OAuth authentication (Google, GitHub)
- [x] User session management
- [x] Protected routes
- [x] Employee authentication (mobile app)

#### Company & Site Management
- [x] Create and manage companies
- [x] Create and manage sites
- [x] Site photo uploads
- [x] Address management
- [x] Client contact information

#### Employee Management
- [x] Employee CRUD operations
- [x] Employee codes
- [x] Employee status tracking (active, inactive, terminated)
- [x] Employee positions (employee, senior, supervisor)
- [x] Employee profiles

#### Shift Management
- [x] Create shifts (recurring and one-time)
- [x] Shift scheduling with start/end times
- [x] Off days configuration
- [x] Shift assignments to employees
- [x] Shift assignment requests
- [x] Shift exclude/include days
- [x] Pay rate configuration
- [x] Overtime multiplier

#### Attendance Tracking
- [x] Attendance recording
- [x] Attendance heatmap visualization
- [x] Attendance history

#### Incident Management
- [x] Create incident reports
- [x] Incident details and descriptions
- [x] Incident tracking

#### Payroll Management
- [x] Payroll generation
- [x] Payroll summary dashboard
- [x] Payroll history

#### Dashboard & Analytics
- [x] KPI cards (Active Guards, Incidents, Compliance, Payroll)
- [x] Roster snapshot
- [x] Attendance heatmap
- [x] Incident reports
- [x] Compliance alerts
- [x] Payroll summary
- [x] Messaging panel

#### Messaging
- [x] Internal messaging system
- [x] Messages between administrators and employees

#### Mobile Application
- [x] Flutter mobile app
- [x] Employee authentication
- [x] Dashboard navigation
- [x] Bottom navigation bar
- [x] App icons configured

---

## 📋 TODO / Not Implemented

### 🔴 High Priority

- [ ] **Forgot Password Integration**
  - Add forgot password functionality with Resend email service
  - Password reset flow

- [ ] **Supabase Storage Cleanup**
  - Fix: Site pictures are not deleting from Supabase bucket when sites are deleted
  - Implement proper cleanup on site deletion

- [ ] **Shift Validation**
  - Add validation in shift dialog:
    - If user selects company → list company's sites
    - If user selects site → auto-select company ID

### 🟡 Medium Priority

- [ ] **Shift-Based Payroll**
  - Implement shift-based payroll calculation
  - Calculate payroll based on actual shifts worked

- [ ] **Employee Hours Tracking**
  - Ability to track employee hours
  - Hours calculation based on shift assignments and attendance
  - Overtime hours tracking

### 🟢 Low Priority / Future Enhancements

- [ ] Real-time notifications
- [ ] Push notifications for mobile app
- [ ] Advanced reporting and analytics
- [ ] Export functionality (PDF, Excel)
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Audit logs
- [ ] Role-based access control (RBAC)
- [ ] API documentation
- [ ] Unit and integration tests
- [ ] E2E testing

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

---

## 📄 License

This project is private and proprietary.

---

## 🔗 Links

- [TanStack Router Documentation](https://tanstack.com/router)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)
- [Flutter Documentation](https://flutter.dev/docs)

---

<div align="center">

Made with ❤️ for security management

</div>
