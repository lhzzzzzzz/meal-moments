import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { LocaleProvider } from '@/components/i18n/locale-provider'
import { getLocale, getTranslator } from '@/lib/i18n/get-locale'
import { localeToHtmlLang } from '@/lib/i18n/config'

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator()
  return {
    title: t('meta.appName'),
    description: t('meta.description'),
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={localeToHtmlLang(locale)} className="h-full">
      <body className="min-h-full bg-background text-foreground antialiased">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
