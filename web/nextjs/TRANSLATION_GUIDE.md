# Translation Guide

This project uses `next-intl` for internationalization (i18n) with support for English and Portuguese.

## Structure

- **Translation files**: `messages/en.json` and `messages/pt.json`
- **Config**: `src/i18n/config.ts`
- **Middleware**: `src/middleware.ts` (handles locale routing)

## URLs

- English: `/en/...` (default)
- Portuguese: `/pt/...`
- Root `/` redirects to `/en`

## Using Translations

### In Client Components

```tsx
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('modernize');
  
  return <h1>{t('title')}</h1>;
}
```

### In Server Components

```tsx
import { useTranslations } from 'next-intl';

export default async function MyComponent() {
  const t = await getTranslations('modernize');
  
  return <h1>{t('title')}</h1>;
}
```

### Adding New Translations

1. Add the key-value pair to both `messages/en.json` and `messages/pt.json`
2. Use nested objects for organization:
   ```json
   {
     "section": {
       "key": "value"
     }
   }
   ```
3. Access with `t('section.key')`

## Language Switcher

The language switcher appears in the top-right corner. It's already included in the layout.

## Adding More Languages

1. Add locale to `src/i18n/config.ts`:
   ```ts
   export const locales = ['en', 'pt', 'es'] as const;
   ```
2. Create `messages/es.json` with translations
3. Update middleware matcher if needed

