// This file is intentionally minimal - next-intl middleware handles locale routing
// The actual layout with translations is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
