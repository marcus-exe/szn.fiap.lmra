import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import '../globals.css';
import RollingSlider from '@/components/RollingSlider';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <div className="flex justify-end p-4">
              <LanguageSwitcher />
            </div>
            <main className="flex-1">{children}</main>
            <div className="mt-auto">
              <RollingSlider />
              <Footer />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

