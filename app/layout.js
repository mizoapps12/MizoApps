import './globals.css'
import Header from './components/Header'
import { SettingsProvider } from './components/SettingsContext'

export const metadata = { title: 'MizoApps', description: 'Mizo thawnthu tha ber' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          <Header/>
          {children}
        </SettingsProvider>
      </body>
    </html>
  )
}
