# LMRA Web Frontend

Next.js 14 web application for the Legacy Modernization Reference Application.

## Features

- Modern React with Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- **Internationalization (i18n)**: Full support for English and Portuguese
- API integration with backend services
- Responsive design

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Internationalization**: next-intl
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Docker

```bash
docker build -t lmra-web .
docker run -p 3000:3000 lmra-web
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   ├── page.tsx       # Home page
│   │   ├── tickets/       # Tickets pages
│   │   ├── users/         # Users pages
│   │   ├── ai/            # AI assistant pages
│   │   ├── docs/          # Documentation pages
│   │   └── modernize/     # Code modernization pages
│   ├── components/         # React components
│   │   └── LanguageSwitcher.tsx
│   └── i18n/              # Internationalization config
│       ├── config.ts      # Locale configuration
│       └── request.ts     # Server-side translation loader
├── components/             # React components
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript types
└── middleware.ts          # Next.js middleware for i18n routing

messages/                   # Translation files
├── en.json                # English translations
└── pt.json                # Portuguese translations
```

## Internationalization

The application supports multiple languages using `next-intl`:

- **Supported Locales**: English (`en`) and Portuguese (`pt`)
- **URL Structure**: All routes are prefixed with locale (`/en/*` or `/pt/*`)
- **Language Switcher**: Available in the top-right corner on all pages
- **Translation Files**: Located in `messages/` directory
  - `messages/en.json` - English translations
  - `messages/pt.json` - Portuguese translations

### Adding Translations

1. Add translation keys to both `messages/en.json` and `messages/pt.json`
2. Use `useTranslations` hook in client components:
   ```tsx
   import { useTranslations } from 'next-intl';
   
   const t = useTranslations('namespace');
   return <h1>{t('title')}</h1>;
   ```
3. Use `getTranslations` in server components:
   ```tsx
   import { getTranslations } from 'next-intl/server';
   
   const t = await getTranslations('namespace');
   return <h1>{t('title')}</h1>;
   ```

### Testing Translations

Access pages with locale prefix:
- English: `http://localhost:3000/en/tickets`
- Portuguese: `http://localhost:3000/pt/tickets`
- Root redirects to `/en` by default

See [TRANSLATION_GUIDE.md](TRANSLATION_GUIDE.md) for detailed instructions.

## Environment Variables

- `NEXT_PUBLIC_API_USERS` - Users service URL (default: http://localhost:8080)
- `NEXT_PUBLIC_API_TICKETS` - Tickets service URL (default: http://localhost:8081)
- `NEXT_PUBLIC_API_AI` - AI Gateway URL (default: http://localhost:8082)

## Legacy vs Modern

### Before (Legacy)
- jQuery for DOM manipulation
- Thymeleaf server-side rendering
- No build process
- Inline styles and scripts
- Hardcoded text (no i18n support)

### After (Modern)
- Next.js with React
- TypeScript for type safety
- Build-time optimization
- Component-based architecture
- CSS Modules and Tailwind
- Modern bundling with Webpack/Turbopack
- **Internationalization with next-intl**
- **Multi-language support (EN/PT)**

