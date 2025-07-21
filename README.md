# Realtor Service Platform

A comprehensive platform for real estate professionals built with SvelteKit and Supabase.

![Screenshot](static/screenshot.png) <!-- Add actual screenshot path -->

## Key Features

- **Property Listings Management**: Create, update and manage property listings
- **Open Houses Scheduling**: Schedule and track open house events
- **Offer Management**: Handle property offers and negotiations
- **Property Services**:
  - Staging services coordination
  - Cleaning services management
- **User Credit System**: Track and manage user credits
- **Social Media Integration**: Manage social media promotions
  - Pre-configured templates for Facebook, Instagram
  - Scheduled posting
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
- **Email**: 
  - Resend 3.0.0
- **Testing**:
  - Playwright 1.42.0 (E2E testing)

## Project Structure

```
.
├── src/
│   ├── app.html          # Main HTML template
│   ├── app.css           # Global styles
│   ├── app.d.ts          # Type definitions
│   ├── lib/
│   │   ├── components/   # Reusable UI components
│   │   │   ├── admin/    # Admin components (Coupon, User management)
│   │   │   ├── cleanings/ # Cleaning service components
│   │   │   ├── credit/   # Credit system components
│   │   │   ├── dashboard/ # Dashboard components
│   │   │   ├── form/     # Form components
│   │   │   ├── home/     # Home page components
│   │   │   ├── listings/ # Property listing components
│   │   │   ├── offer/    # Property offer components
│   │   │   ├── social/   # Social media service components
│   │   │   ├── stagings/ # Property staging components
│   │   │   └── video/    # Video service components
│   │   ├── db/           # Database operations
│   │   │   └── client.ts # Database client
│   │   ├── email.ts      # Email service
│   │   ├── helper.ts     # Utility functions
│   │   ├── http.ts       # HTTP utilities
│   │   └── stores/       # State management
├── static/               # Static assets
├── tests/                # Test files
├── svelte.config.js      # SvelteKit config
└── tailwind.config.js    # TailwindCSS config
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account
- Stripe account

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-repo/realtorservice.git
cd realtorservice
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase and Stripe credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=your-stripe-publishable-key
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run check`: Run type checking
- `npm run test`: Run E2E tests with Playwright

## Deployment

The project is configured to deploy to Vercel, Netlify, or any Node.js hosting platform using the SvelteKit adapter-auto.

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Manual Deployment

For production deployment:
```bash
npm run build
```

The built application will be in the `build` directory.

## API Documentation

### Supabase API

1. **Authentication**:
   - Email/password login
   - Social login (Google, Facebook)
   - Magic link

2. **Database**:
   - PostgreSQL tables for:
     - Users
     - Properties
     - Offers
     - Services

3. **Storage**:
   - Property images
   - Document uploads

### Stripe API

- Payment processing
- Subscription management
- Webhook integration

Refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature
```
3. Commit your changes:
```bash
git commit -m "Add your feature"
```
4. Push to the branch:
```bash
git push origin feature/your-feature
```
5. Open a pull request

## License

MIT License

## Support

For support, please open an issue on GitHub or contact support@realtorservice.com