import './globals.css'
import { Inter } from 'next/font/google'
import ClientLayout from '@/components/ClientLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dinamiz TIC',
  description: 'Sistema de gestión integral para área de tecnología',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Dinamiz TIC',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#22c55e',
  appleMobileWebAppCapable: 'yes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
