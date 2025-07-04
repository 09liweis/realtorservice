# Realtor Service - Property Listing Platform

## Overview
A modern real estate listing platform built with SvelteKit, featuring property listings, user authentication, and payment processing.

## Features
- User authentication (login/register)
- Property listings management
- User dashboard
- Payment processing via Stripe
- Responsive design with TailwindCSS

## Technology Stack
- Frontend: SvelteKit
- Styling: TailwindCSS
- Database: Supabase
- Payments: Stripe
- TypeScript for type safety

## Project Structure
```
realtorservice/
├── src/
│   ├── lib/          # Shared components and utilities
│   ├── routes/       # Application pages and API routes
│   │   ├── about/    # About page
│   │   ├── api/      # API endpoints
│   │   ├── dashboard/ # User dashboard
│   │   ├── listings/ # Property listings
│   │   ├── login/    # Authentication
│   │   └── register/
│   ├── app.html      # Main HTML template
├── static/           # Static assets
├── .env              # Environment variables
├── package.json      # Project dependencies
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm (v7+ recommended)

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Environment Variables
Create a `.env` file based on `.env.example` and configure:
- `PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `STRIPE_SECRET_KEY`: Your Stripe secret key

### Development
Start the development server:
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Deployment
The project can be deployed to any platform that supports Node.js applications, such as:
- Vercel
- Netlify
- Cloudflare Pages

## License
[MIT](LICENSE)