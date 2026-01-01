# RagdolProperty - Real Estate Platform

A comprehensive Next.js-based real estate website for Dubai property market, featuring multi-role user management, property listings, agent portals, and admin dashboard.

## 🚀 Features

### Core Functionality
- **Property Listings**: Advanced search, filtering, and detailed property pages
- **Agent Management**: Agent profiles, ratings, contact forms, and dedicated portals
- **User Portals**: Separate dashboards for customers, agents, and administrators
- **Property Valuation**: Online valuation requests and mortgage calculators
- **Internationalization**: Multi-language support (English, Arabic, French) with RTL
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Features
- Dashboard with analytics and reports
- CRUD operations for properties, agents, projects, and users
- Download interest management
- Property reviews and questions management
- System settings and SEO management

### Agent Features
- Personal dashboard and profile management
- Property management and applications tracking
- Statistics and performance metrics

### Customer Features
- Saved properties and enquiries
- Property valuation requests
- Profile management and signup/login

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Maps**: Leaflet for location picker
- **Email**: SendGrid
- **Icons**: Heroicons
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
ragdolproperty/
├── app/                          # Next.js App Router
│   ├── (website)/                # Public website pages (about, properties, etc.)
│   ├── (admin)/admin/            # Admin portal pages
│   ├── (agent)/agent/            # Agent portal pages
│   ├── (customer)/customer/      # Customer portal pages
│   ├── (auth)/auth/              # Authentication pages
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Reusable UI components (categorized)
│   ├── layouts/                  # Layout components (Header, Footer, etc.)
│   ├── forms/                    # Form components (PropertyForm, etc.)
│   ├── property/                 # Property-specific components
│   ├── agent/                    # Agent-specific components
│   ├── shared/                   # Shared/common components
│   ├── admin/                    # Admin-specific components
│   └── ui/                       # Base UI components
├── lib/                          # Utilities and configurations
├── contexts/                     # React contexts
├── public/                       # Static assets
├── supabase/                     # Supabase configuration
└── scripts/                      # Utility scripts
```

## 🏗 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ragdolproperty
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   Configure the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Supabase Setup**
   ```bash
   # Start local Supabase
   npx supabase start

   # Run migrations
   npx supabase db push
   ```

4. **Seed Data (Optional)**
   ```bash
   # Seed agents
   node scripts/seed-agents.sh
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
npm run start
```

## 📄 Pages & Routes

### Public Pages
- `/` - Homepage with hero slider and featured listings
- `/properties` - Property search and listings
- `/properties/[id]` - Property details
- `/agents` - Agent directory
- `/agents/[id]` - Agent profile
- `/projects` - Project listings
- `/projects/[id]` - Project details
- `/calculators` - Mortgage calculator
- `/contact` - Contact form
- `/about`, `/blog`, `/news`, `/faq`, etc.

### User Portals
- **Admin**: `/admin/*` - Dashboard, agents, properties, projects management
  - `/admin/properties` - Dedicated properties management page
- **Agent**: `/agent/*` - Dashboard, properties, applications
- **Customer**: `/customer/*` - Dashboard, saved properties, valuations

### Authentication
- `/auth/login` - General login
- `/auth/admin` - Admin login
- `/auth/callback` - OAuth callback

## 🔌 API Endpoints

### Properties
- `GET/POST /api/properties` - List/create properties
- `GET/PUT/DELETE /api/properties/[id]` - Property CRUD

### Agents
- `GET/POST /api/agents` - List/create agents
- `GET/PUT/DELETE /api/admin/agents/[id]` - Agent management

### Admin Operations
- `/api/admin/*` - Properties, agents, projects, users, valuations
- `/api/admin/clear-data` - Reset database
- `/api/admin/seed-agents-dev` - Seed development data

### User Operations
- `/api/customer/enquiries` - Customer enquiries
- `/api/agent/dashboard` - Agent dashboard data
- `/api/valuations` - Property valuations

## 🗄 Database Schema

### Core Tables
- `properties` - Property listings with images, location, pricing
- `agents` - Agent profiles with ratings and specializations
- `users` - User accounts with roles
- `projects` - Real estate projects
- `enquiries` - Customer enquiries
- `property_reviews` - Property reviews
- `valuations` - Property valuation requests

### Relationships
- Properties ↔ Agents (many-to-one)
- Users ↔ Enquiries (one-to-many)
- Properties ↔ Projects (many-to-one)

## 🎨 Key Components

### Layout Components
- `Header` - Navigation with language/currency switchers
- `Footer` - Site footer with links
- `ConditionalLayout` - Role-based layout switching

### Property Components
- `PropertyCard` - Property listing card
- `PropertySlider` - Carousel for property listings
- `PropertyImageGallery` - Image gallery with video support
- `PropertyForm` - Property creation/editing form

### Agent Components
- `AgentSlider` - Agent carousel
- `AgentContactForm` - Contact form for agents
- `AgentSidebar` - Agent portal navigation

### Forms & Modals
- `ValuationModal` - Property valuation request
- `DownloadInterestForm` - Interest download form
- `UserForm` - User profile form

### Utilities
- `FloatingActionButtons` - WhatsApp and chatbot buttons
- `FloatingTools` - Language, currency, area selectors
- `MortgageCalculator` - Loan calculation tool
- `LocationPicker` - Interactive map for location selection

## 🌐 Internationalization

Supports English, Arabic, and French with:
- Dynamic direction (LTR/RTL)
- Locale files in `lib/locales/`
- I18nProvider for React integration

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run start
```

### Supabase Production
- Push migrations to production
- Update environment variables
- Configure custom domain

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Create Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Tailwind for styling
- Write descriptive commit messages

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact the development team

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js and Supabase

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
