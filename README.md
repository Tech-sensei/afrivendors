# AfriVendors Client

**Connecting African Vendors to the World**

AfriVendors is a modern marketplace platform that connects service vendors across Africa with customers seeking quality services. Built with Next.js 16 and React 19, the platform provides a seamless experience for discovering, booking, and managing vendor services.

---

## 🌟 Features

### Public Features
- **Vendor Discovery**: Browse featured, trending, and new vendors across multiple categories
- **Advanced Search & Filtering**: Find vendors by category, location, rating, and availability
- **Vendor Profiles**: Detailed vendor information with portfolios, reviews, and service offerings
- **Booking System**: Streamlined appointment booking with custom service requests
- **Reviews & Ratings**: Community-driven vendor ratings and detailed customer reviews
- **Blog & Resources**: Educational content about vendors and services
- **Mobile App Integration**: Download app section with cross-platform support

### User Dashboard
- **Appointments Management**: View, track, and manage service appointments
- **Messages**: Direct communication with vendors
- **Wallet**: Manage payments, transactions, and withdrawal requests
- **Favorites**: Save and organize preferred vendors
- **Profile Management**: Edit personal information and business profiles
- **Settings**: Account preferences, notifications, and privacy controls
- **Help & Support**: Access to customer support and FAQs

### Additional Pages
- About Us
- How It Works
- Pricing
- Contact Us
- Privacy Policy & Terms of Service

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions
- **next-themes** - Dark mode support

### Form & Data Management
- **React Day Picker** - Date selection for bookings
- **date-fns** - Date utility library
- **Sonner** - Toast notifications

### Development Tools
- **Biome** - Fast linter and formatter
- **React Compiler** - Automatic React optimization

### Design System
- Custom fonts: **Unbounded** (headings) and **Unageo** (body text)
- Component library built with **shadcn/ui** patterns
- Consistent design tokens and utilities

---

## 📁 Project Structure

```
afrivendors-client/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   ├── (dashboard)/              # User dashboard pages
│   │   │   ├── appointments/
│   │   │   ├── messages/
│   │   │   ├── wallet/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   └── favourites/
│   │   ├── (publicPages)/            # Public-facing pages
│   │   │   ├── about-us/
│   │   │   ├── blog/
│   │   │   ├── booking/
│   │   │   ├── categories/
│   │   │   ├── contact-us/
│   │   │   ├── how-it-works/
│   │   │   ├── pricing/
│   │   │   └── privacy-policy/
│   │   ├── globals.css               # Global styles
│   │   └── layout.tsx                # Root layout
│   ├── components/                   # React components
│   │   ├── ui/                       # Reusable UI components
│   │   ├── views/                    # Page section components
│   │   ├── appointments/             # Appointment-specific components
│   │   ├── booking/                  # Booking flow components
│   │   ├── dashboard/                # Dashboard components
│   │   ├── messages/                 # Messaging components
│   │   ├── settings/                 # Settings components
│   │   ├── wallet/                   # Wallet components
│   │   └── global/                   # Shared global components
│   ├── data/                         # Static data and mock data
│   └── lib/                          # Utility functions and helpers
├── public/                           # Static assets
│   └── fonts/                        # Custom font files
├── components.json                   # shadcn/ui configuration
├── biome.json                        # Biome linter/formatter config
├── tailwind.config.ts                # Tailwind configuration
└── tsconfig.json                     # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or higher
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd afrivendors-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run Biome linter
npm run format   # Format code with Biome
```

---

## 🎨 Design System

### Typography
- **Headings**: Unbounded (geometric sans-serif)
- **Body**: Unageo (clean, modern sans-serif)

### Component Library
Built with Radix UI primitives and custom styling:
- Buttons, Inputs, Selects
- Dialogs, Drawers, Alerts
- Tabs, Dropdowns, Checkboxes
- Avatars, Separators, Scroll Areas
- And more...

### Theming
- Light and dark mode support via `next-themes`
- Consistent color tokens
- Responsive design patterns

---

## 📱 Responsive Design

The platform is fully responsive with optimized layouts for:
- **Mobile** (< 768px)
- **Tablet** (768px - 1024px)
- **Desktop** (> 1024px)

---

## 🔐 Authentication & Authorization

The platform includes authentication flows with:
- User registration and login
- OTP verification
- Protected dashboard routes
- Role-based access (customers and vendors)

---

## 🌍 Deployment

### Vercel (Recommended)
The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- AWS Amplify
- Netlify
- Railway
- DigitalOcean App Platform

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential.

---

## 📞 Support

For support, please visit the Help & Support section in the dashboard or contact the development team at info@afrivendors.com

---

**Built with ❤️ for the African vendor community**
