# Realtor Service Platform

A comprehensive platform for real estate professionals built with SvelteKit and Supabase.

![Screenshot](static/screenshot.png) <!-- Add actual screenshot path -->

## Key Features

- **Property Listings Management**: Create, update and manage property listings with rich media support
- **Open Houses Scheduling**: Schedule and track open house events with calendar integration
- **Offer Management**: Handle property offers and negotiations with tracking
- **Property Services**:
  - Staging services coordination with vendor management
  - Cleaning services management with scheduling
- **User Credit System**: Track and manage user credits for services
- **Social Media Integration**: Manage social media promotions
  - Pre-configured templates for Facebook, Instagram
  - Scheduled posting with analytics
- **Video Services**: Property video production coordination
- **Payment Processing**: Integrated Stripe payments for services with invoice generation

## Technology Stack

- **Frontend**: 
  - SvelteKit 2.16.0 (Latest stable)
  - Svelte 5.25.0 (Latest)
  - TailwindCSS 4.1.10 with custom theming
- **Backend Services**:
  - Supabase 2.50.0 (Database & Auth)
- **Payment**: 
  - Stripe 18.2.1 with webhook integration
- **Email**: 
  - Resend 3.0.0 with template support
- **Testing**:
  - Playwright 1.42.0 (E2E testing)
  - Vitest 1.5.0 (Unit testing)

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
- npm 9+ or pnpm 8+
- Supabase account (free tier available)
- Stripe account (developer mode available)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-repo/realtorservice.git
cd realtorservice
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
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
STRIPE_SECRET_KEY=your-stripe-secret-key

# Resend Email Configuration
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=no-reply@yourdomain.com

# Application Settings
VITE_BASE_URL=http://localhost:5173
VITE_DEFAULT_LOCALE=en-US
```

4. Initialize the database:
```bash
npm run db:init
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build optimized production version
- `npm run preview`: Preview production build locally
- `npm run check`: Run TypeScript type checking
- `npm run test`: Run all tests (unit + E2E)
- `npm run test:unit`: Run unit tests with Vitest
- `npm run test:e2e`: Run E2E tests with Playwright
- `npm run db:init`: Initialize database schema
- `npm run lint`: Run ESLint and Prettier checks

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

3. Set up environment variables in Vercel dashboard

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
   - Magic link authentication
   - Session management

2. **Database**:
   - PostgreSQL tables for:
     - Users (profiles, roles)
     - Properties (listings, media)
     - Offers (status, history)
     - Services (cleaning, staging, etc.)

3. **Storage**:
   - Property images (resizing, optimization)
   - Document uploads (PDF, DOCX)

### Stripe API

- Payment processing (one-time and subscriptions)
- Invoice generation and emailing
- Webhook integration for payment events

### Example API Usage

```typescript
// Creating a new property listing
const { data, error } = await supabase
  .from('properties')
  .insert([
    { 
      title: 'Modern Downtown Apartment',
      description: '2BR apartment with city views',
      price: 450000,
      location: 'New York, NY'
    }
  ])
  .select()
```

Refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [SvelteKit API Reference](https://kit.svelte.dev/docs)

## Usage Examples

### Creating a Property Listing

1. Log in as agent/admin
2. Navigate to Dashboard > Listings
3. Click "Add New Listing"
4. Fill in property details and upload images
5. Set up open house schedule if applicable
6. Publish listing

### Managing Offers

1. From property listing, click "View Offers"
2. Review incoming offers
3. Negotiate terms via built-in messaging
4. Accept/reject offers with comments

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature
```
3. Commit your changes following conventional commits:
```bash
git commit -m "feat: add new listing filters"
```
4. Push to the branch:
```bash
git push origin feature/your-feature
```
5. Open a pull request with detailed description

### Development Guidelines

- Follow SvelteKit best practices
- Use TypeScript for all new code
- Write unit tests for business logic
- Add E2E tests for critical user flows
- Document new features in README

## License

MIT License

## Support

For support, please:
1. Check the [FAQ]() section
2. Open an issue on GitHub
3. Contact support@realtorservice.com

Include:
- Detailed description of the issue
- Steps to reproduce
- Screenshots if applicable
- Browser/OS information