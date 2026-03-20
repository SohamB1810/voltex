import './globals.css'

export const metadata = {
  title: 'VŌLTEX — Commerce Platform',
  description: 'New Current. Modern ecommerce management.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="v-cursor-dot" />
        <div id="v-cursor-ring" />
        {children}
      </body>
    </html>
  )
}
