import './globals.css'

export const metadata = {
  title: 'VeoGrowth - AI-Powered GTM Strategy & Campaign Generator',
  description: 'Get your complete go-to-market strategy and campaign ideas in 60 seconds',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
