import './globals.css'
import Header from './components/Header'
import { SettingsProvider } from './components/SettingsContext'

export const metadata = { title: 'MizoApps', description: 'Mizo thawnthu tha ber' }
// app/layout.js chung ber ah add rawh
<script dangerouslySetInnerHTML={{__html:`
  (function(){
    const theme = localStorage.getItem('theme');
    const font = localStorage.getItem('siteFontSize');
    if(theme==='dark') document.documentElement.classList.add('dark-mode');
    if(font) document.documentElement.style.fontSize = font+'px';
  })()
`}} />
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
