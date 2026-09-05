import './globals.css'
import Header from './components/Header'
import { SettingsProvider } from './components/SettingsContext'

export const metadata = { title: 'MizoApps', description: 'Mizo thawnthu tha ber' }

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try{
                  const theme = localStorage.getItem('theme');
                  const font = localStorage.getItem('siteFontSize');
                  if(theme==='dark') document.documentElement.classList.add('dark-mode');
                  if(font) document.documentElement.style.fontSize = font+'px';
                }catch(e){}
              })()
            `,
          }}
        />
      </head>
      <body>
        <SettingsProvider>
          <Header/>
          {children}
        </SettingsProvider>
      </body>
    </html>
  )
}
