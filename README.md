# Realtor Service Platform

## Overview
A comprehensive real estate service platform built with SvelteKit and Supabase, providing property management, cleaning services, social media marketing, and more for real estate professionals.

## Key Features
- **Property Management**
  - Listing creation and management
  - Offer tracking and management
  - Open house scheduling and guest tracking

- **Cleaning Services**
  - Cleaning service booking and management
  - Financial and property information tracking
  - Service scheduling

- **Social Media Services**
  - Social media marketing campaign management
  - Service pricing and details tracking
  - Campaign performance monitoring

- **Video Services**
  - Property video service management
  - Video production tracking
  - Pricing and details management

- **Staging Services**
  - Property staging management
  - Financial and property information tracking
  - Staging details and timeline

- **User & Admin Features**
  - User authentication (login/register)
  - Admin dashboard with user management
  - Coupon and promotion management
  - Payment processing via Stripe
  - Performance analytics with Chart.js

## Technology Stack
- **Frontend**: SvelteKit (v5.25.0)
- **Styling**: TailwindCSS
- **State Management**: Svelte Stores
- **Backend Services**: Supabase
- **Payments**: Stripe
- **Data Visualization**: Chart.js
- **Build Tool**: Vite
- **Type Safety**: TypeScript

## Project Structure
```
realtorservice/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── admin/        # Admin components
│   │   │   ├── cleanings/    # Cleaning service components
│   │   │   ├── listings/     # Property listing components
│   │   │   ├── social/       # Social media service components
│   │   │   ├── stagings/     # Staging service components
│   │   │   └── video/        # Video service components
│   │   ├── db/              # Database client and utilities
│   │   ├── stores/          # Application state stores
│   │   └── helper.ts        # Utility functions
│   ├── app.css              # Global styles
│   ├── app.html             # Main HTML template
├── .env                     # Environment variables
├── package.json             # Project dependencies
├── social_media_table.sql   # Database schema example
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm (v7+ recommended)
- Supabase account
- Stripe account (for payment processing)

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Environment Setup
Create a `.env` file with the following variables:
```env
PUBLIC_SUPABASE_URL=your-supabase-url
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

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

## API Documentation
The platform uses Supabase for backend services. Refer to:
- [Supabase JavaScript Client Documentation](https://supabase.com/docs/reference/javascript/introduction)
- [Stripe API Documentation](https://stripe.com/docs/api)

## Deployment
The project can be deployed to any platform that supports Node.js applications:

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy
```

### Cloudflare Pages
```bash
wrangler pages deploy ./build
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
[MIT](LICENSE)