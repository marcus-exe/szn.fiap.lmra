# Testing Translation System

## Quick Test Steps

### 1. Rebuild and Start the Web Container

```bash
# From project root
docker-compose build web
docker-compose up -d web
```

### 2. Wait for Container to Start

```bash
# Check if web container is healthy
docker-compose ps web

# View logs to ensure it started correctly
docker-compose logs web | tail -20
```

### 3. Test URLs

Open your browser and test these URLs:

**English (default):**
- `http://localhost:3000/en` - Home page
- `http://localhost:3000/en/modernize` - Modernize page (translated)
- `http://localhost:3000/en/tickets` - Tickets page

**Portuguese:**
- `http://localhost:3000/pt` - Home page (Portuguese)
- `http://localhost:3000/pt/modernize` - Modernize page (Portuguese)
- `http://localhost:3000/pt/tickets` - Tickets page

**Root redirect:**
- `http://localhost:3000/` - Should redirect to `/en`

### 4. Test Language Switcher

1. Go to any page (e.g., `/en/modernize`)
2. Look for the language switcher in the top-right corner (EN/PT buttons)
3. Click "PT" - URL should change to `/pt/modernize` and text should change to Portuguese
4. Click "EN" - URL should change to `/en/modernize` and text should change to English

### 5. Verify Translations

On the modernize page (`/pt/modernize`), you should see:
- ✅ "Modernização de Código Legado" instead of "Legacy Code Modernization"
- ✅ "Análise Completa do Código" instead of "Full Codebase Analysis"
- ✅ "Histórico" instead of "History"
- ✅ "URL do Repositório GitHub" instead of "GitHub Repository URL"
- ✅ All form labels and buttons in Portuguese

On `/en/modernize`, you should see:
- ✅ All text in English

### 6. Test Navigation

- Click "Back to Home" - should navigate to `/[locale]/`
- Navigate between pages - locale should persist in URL
- Refresh page - locale should stay the same

## Troubleshooting

### If you see errors:

1. **Check container logs:**
   ```bash
   docker-compose logs web
   ```

2. **Rebuild from scratch:**
   ```bash
   docker-compose build --no-cache web
   docker-compose up -d web
   ```

3. **Verify translation files exist:**
   ```bash
   ls -la web/nextjs/messages/
   # Should show en.json and pt.json
   ```

4. **Check middleware:**
   ```bash
   # Middleware should be at src/middleware.ts
   cat web/nextjs/src/middleware.ts
   ```

### Expected Behavior

✅ URLs should always have locale prefix (`/en/` or `/pt/`)
✅ Language switcher should update URL and reload content
✅ Text should change based on locale
✅ Navigation should preserve locale
✅ Root `/` should redirect to `/en`

## Manual Testing Checklist

- [ ] Home page shows in English at `/en`
- [ ] Home page shows in Portuguese at `/pt`
- [ ] Language switcher buttons work (EN/PT)
- [ ] Modernize page titles are translated
- [ ] Form labels are translated
- [ ] Button text is translated
- [ ] History tab is translated
- [ ] Navigation preserves locale
- [ ] Root redirects to `/en`

