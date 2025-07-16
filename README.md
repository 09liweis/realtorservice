# Realtor Service Platform

A comprehensive platform for real estate professionals built with SvelteKit and Supabase.

## Key Features

- **Property Listings Management**: Create, update and manage property listings
- **Open Houses Scheduling**: Schedule and track open house events
- **Offer Management**: Handle property offers and negotiations
- **Property Services**:
  - Staging services coordination
  - Cleaning services management
- **User Credit System**: Track and manage user credits
- **Social Media Integration**: Manage social media promotions
- **Video Services**: Property video production coordination
- **Payment Processing**: Integrated Stripe payments for services

## Technology Stack

- **Frontend**: 
  - SvelteKit 2.16.0
  - Svelte 5.25.0
  - TailwindCSS 4.1.10
- **Backend Services**:
  - Supabase 2.50.0 (Database & Auth)
- **Payment**: 
  - Stripe 18.2.1

## Project Structure

```
.
├── src/
│   ├── app.html          # Main HTML template
│   ├── app.css           # Global styles
│   ├── routes/           # Application pages
│   │   ├── dashboard/    # User dashboard
│   │   ├── listings/     # Property listings
│   │   ├── profile/      # User profile
│   │   └── auth/         # Authentication flows
│   └── lib/
│       ├── components/   # Reusable UI components
│       ├── db/           # Database operations
│       ├── stores/       # State management
│       └── supabase.ts   # Supabase client config
├── static/               # Static assets
├── svelte.config.js      # SvelteKit config
└── tailwind.config.js    # TailwindCSS config
```

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Create a `.env` file with your Supabase and Stripe credentials:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_STRIPE_PUBLIC_KEY=your-stripe-key
```
4. Run the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run check`: Run type checking

## Deployment

The project is configured to deploy to Vercel, Netlify, or any Node.js hosting platform using the SvelteKit adapter-auto.

For production deployment:
```bash
npm run build
```

## API Documentation

The platform integrates with the following APIs:

1. **Supabase API**:
   - Authentication
   - Database operations
   - Storage

2. **Stripe API**:
   - Payment processing
   - Subscription management

Refer to the respective API documentation for detailed integration information.