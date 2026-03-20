import './globals.css'
import Providers from '@/components/Providers'

export const metadata = {
  title: 'VŌLTEX — Commerce Platform',
  description: 'New Current. Modern ecommerce management.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div id="v-cursor-dot" suppressHydrationWarning />
        <div id="v-cursor-ring" suppressHydrationWarning />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}