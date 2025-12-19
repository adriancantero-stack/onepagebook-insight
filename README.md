# 📚 OnePageBook - AI-Powered Book Summaries

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.58-3ecf8e.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> Transform any book into practical insights in minutes with AI-powered summaries.

**Official Domain**: [onepagebook.ai](https://onepagebook.ai)  
**Contact**: contact@onepagebook.ai

---

## 🌟 Features

### Core Functionality
- 📖 **AI-Powered Summaries** - Generate comprehensive book summaries using advanced AI
- 🎧 **Text-to-Speech** - Listen to summaries with high-quality audio generation
- 🌍 **Multilingual Support** - Available in Portuguese, Spanish, and English
- 📚 **Book Catalog** - Extensive catalog with 500+ pre-indexed books
- 💾 **Smart Caching** - Instant access to previously generated summaries
- 📱 **PWA Support** - Install as a native app on any device

### Gamification System
- 🏆 **Achievements** - Unlock achievements as you read and learn
- ⭐ **XP System** - Earn experience points for various activities
- 📊 **User Rankings** - Compete with other readers on the leaderboard
- 🎯 **Streaks** - Maintain daily reading streaks for bonus rewards
- 🎖️ **Level Progression** - Advance through reader levels

### Premium Features
- ✨ **Unlimited Summaries** - Generate as many summaries as you need
- 🎵 **Audio Summaries** - Access to all audio features
- 📥 **PDF Export** - Download summaries as PDF documents
- 🎴 **Flashcards** - Practice with AI-generated flashcards
- 🎓 **Learning Enhancement** - Advanced learning tools and analytics

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend services)

### Installation

```bash
# Clone the repository
git clone https://github.com/adriancantero-stack/onepagebook-insight.git

# Navigate to project directory
cd onepagebook-insight

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.4
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: Zustand + TanStack Query
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **i18n**: react-i18next

### Backend
- **BaaS**: Supabase
  - PostgreSQL Database
  - Authentication
  - Edge Functions (30+ functions)
  - Storage
  - Real-time subscriptions
- **AI/ML**: Hugging Face Transformers
- **Payments**: Stripe
- **PDF Generation**: jsPDF

### DevOps
- **Hosting**: Vercel
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel automatic deployments
- **Monitoring**: Built-in error boundaries

---

## 🏗️ System Architecture

<div align="center">

```mermaid
graph TD
    User[👤 User] -->|1. Request Summary| Client[💻 React PWA]
    Client -->|2. Query Data| Supabase[⚡ Supabase]
    Supabase -->|3. Auth & RLS| Auth[🔐 Auth Service]
    Client -->|4. Trigger Generation| Edge[☁️ Edge Functions]
    Edge -->|5. AI Processing| AI[🧠 OpenAI/HuggingFace]
    Edge -->|6. Store Summary| DB[(🗄️ PostgreSQL)]
    Client -->|7. Subscription| Stripe[💳 Stripe Payments]
    
    subgraph "Backend Infrastructure"
    Supabase
    Auth
    DB
    Edge
    end
    
    style User fill:#f9f,stroke:#333,stroke-width:2px
    style Client fill:#61dafb,stroke:#333,stroke-width:2px,color:black
    style Supabase fill:#3ecf8e,stroke:#333,stroke-width:2px,color:white
    style Edge fill:#3ecf8e,stroke:#333,stroke-width:2px,color:white
    style AI fill:#ff9900,stroke:#333,stroke-width:2px,color:black
```

</div>

---

## 📁 Project Structure

```
onepagebook/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── admin/          # Admin panel components
│   │   ├── home/           # Home page components
│   │   └── landing/        # Landing page components
│   ├── pages/              # Route pages (29 pages)
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External integrations
│   │   └── supabase/       # Supabase client & types
│   ├── i18n/               # Internationalization
│   │   └── translations/   # PT, ES, EN translations
│   ├── lib/                # Utility libraries
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Helper functions
│   ├── data/               # Static data (book catalog)
│   └── config/             # Configuration files
├── supabase/
│   ├── functions/          # Edge Functions (30+)
│   ├── migrations/         # Database migrations (86)
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── dist/                   # Production build output
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

<div align="center">

```mermaid
erDiagram
    PROFILES ||--o{ BOOK_SUMMARIES : generate
    PROFILES ||--o{ USER_SUBSCRIPTIONS : has
    PROFILES ||--o{ USER_ACHIEVEMENTS : unlocks
    PROFILES ||--o{ USER_STATS : tracks
    BOOK_SUMMARIES }|--|| BOOK_CATALOG : references
    USER_SUBSCRIPTIONS }|--|| SUBSCRIPTION_PLANS : subscribes_to

    PROFILES {
        uuid id PK
        string email
        string full_name
        string avatar_url
    }
    
    BOOK_SUMMARIES {
        uuid id PK
        uuid user_id FK
        text title
        text content
        json metadata
    }

    USER_SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK
        string stripe_id
        string status
    }
```

</div>

### Key Features
- ✅ **Row Level Security (RLS)**: Data isolation per user
- ✅ **Real-time Subscriptions**: Live updates for UI
- ✅ **Automatic Triggers**: Function execution on data changes
- ✅ **Optimized Indexing**: Fast query performance


---

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:8080)

# Build
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Database (requires Supabase CLI)
supabase start           # Start local Supabase
supabase db push         # Apply migrations
supabase functions deploy # Deploy edge functions
```

---

## 🌐 Deployment

### Vercel (Recommended)

The project is configured for automatic deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on every push to `main`

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting provider
```

---

## 🔐 Authentication & Security

- **Authentication**: Supabase Auth with email/password
- **Authorization**: Row Level Security (RLS) policies
- **API Security**: JWT tokens for Edge Functions
- **Data Privacy**: User data isolated by RLS
- **HTTPS**: Enforced on all production endpoints

---

## 💳 Subscription Plans

### Free Plan
- 3 summaries per month
- Basic features
- Community support

### Premium Plan ($9.99/month)
- Unlimited summaries
- Audio summaries
- PDF export
- Flashcards
- Priority support
- Advanced analytics

---

## 🌍 Internationalization

Supported languages:
- 🇧🇷 Portuguese (pt)
- 🇪🇸 Spanish (es)
- 🇺🇸 English (en)

All UI elements, error messages, and content are fully translated.

---

## 📊 Performance

### Build Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Build Time** | ~22s | ⚡ Fast |
| **Bundle Size** | ~300KB | ✅ Optimized |
| **Lighthouse** | 98/100 | 🏅 Excellent |
| **PWA Score** | 100% | 📱 Native-like |

### Optimization Strategy

- **Code Splitting**: Lazy loading of routes and heavy components
- **Caching**: Service Worker implementation for offline access
- **Assets**: WebP generation and SVG optimization
- **Database**: efficient indexing and query caching

---

## 🧪 Testing

```bash
# Unit tests (to be implemented)
npm run test

# E2E tests (to be implemented)
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain existing code style
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Lovable** - Initial project scaffolding
- **Supabase** - Backend infrastructure
- **shadcn/ui** - Beautiful UI components
- **Vercel** - Hosting and deployment
- **OpenAI** - AI-powered summaries

---

## 📞 Support

- **Email**: contact@onepagebook.ai
- **Website**: [onepagebook.ai](https://onepagebook.ai)
- **Issues**: [GitHub Issues](https://github.com/adriancantero-stack/onepagebook-insight/issues)

---

## 🗺️ Roadmap

### Q1 2025
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Book recommendations AI

### Q2 2025
- [ ] API for third-party integrations
- [ ] Browser extension
- [ ] Collaborative reading features
- [ ] Advanced search with filters

---

## 📈 Stats

- **Total Users**: 5,000+
- **Summaries Generated**: 10,000+
- **Books in Catalog**: 500+
- **Languages Supported**: 3
- **Edge Functions**: 30+
- **Database Migrations**: 86

---

**Made with ❤️ by the OnePageBook Team**

*Last Updated: December 2025*
