# Kari Healthcare Platform

A comprehensive healthcare platform built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Authentication System**: User sign-up/sign-in with Supabase Auth
- **Practitioner Discovery**: Search and filter healthcare professionals
- **Appointment Booking**: Book virtual and in-person consultations
- **Dashboard Management**: Patient and practitioner dashboards
- **Practitioner Onboarding**: Multi-step sign-up for healthcare professionals
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **Database**: Supabase (Authentication + PostgreSQL)
- **State Management**: React Context API
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kari-healthcare
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your Supabase project:
   - Create a new Supabase project
   - Copy your project URL and anon key to `.env.local`
   - Set up the database schema (see Database Schema section)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Required Supabase Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'practitioner')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `practitioners`
```sql
CREATE TABLE practitioners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  specialty TEXT NOT NULL,
  credentials TEXT,
  consultation_types TEXT[] NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `appointments`
```sql
CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  practitioner_id UUID REFERENCES practitioners(id) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `reviews`
```sql
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  practitioner_id UUID REFERENCES practitioners(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies for data access control.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── booking/           # Booking flow pages
│   ├── dashboard/         # Dashboard pages
│   ├── practitioner/      # Practitioner-related pages
│   ├── search/            # Search functionality
│   └── ...
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── layout/            # Layout components
│   ├── search/            # Search components
│   ├── ui/                # Shadcn UI components
│   └── ...
└── lib/                   # Utility functions and configurations
    ├── database.ts        # Database service functions
    ├── supabaseClient.js  # Supabase client configuration
    └── utils.ts           # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Key Features Implementation

### Authentication
- User registration and login with Supabase Auth
- Global auth state management with React Context
- Protected routes and session persistence

### Search & Discovery
- Practitioner search with multiple filters
- Specialty, location, date, and rating filters
- Dynamic search results with pagination

### Booking System
- Appointment creation and management
- Calendar integration for availability
- Booking confirmation flow
- Appointment status management

### Dashboard Management
- Patient dashboard with appointment history
- Practitioner dashboard with booking requests
- Profile management and settings

### Practitioner Onboarding
- Multi-step registration form
- Professional information collection
- Automatic role assignment and profile creation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
