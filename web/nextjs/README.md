# LMRA Web Frontend

Next.js 14 web application for the Legacy Modernization Reference Application.

## Features

- Modern React with Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- API integration with backend services
- Responsive design

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
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
├── app/              # Next.js App Router pages
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Home page
│   ├── tickets/     # Tickets pages
│   ├── users/       # Users pages
│   └── ai/          # AI assistant pages
├── components/       # React components
├── lib/             # Utilities and helpers
└── types/           # TypeScript types
```

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

### After (Modern)
- Next.js with React
- TypeScript for type safety
- Build-time optimization
- Component-based architecture
- CSS Modules and Tailwind
- Modern bundling with Webpack/Turbopack

