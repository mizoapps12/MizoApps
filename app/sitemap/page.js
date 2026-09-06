export const metadata = {
  title: 'Sitemap - MizoApps.in',
  description: 'MizoApps.in Sitemap'
}

export default function SitemapPage(){
  return(
    <div style={{maxWidth:'800px', margin:'0 auto', padding:'16px', background:'#fff', borderRadius:'12px'}}>
      <h1 style={{fontSize:'22px', fontWeight:'800', marginBottom:'16px', borderBottom:'2.5px solid #ff8c00', paddingBottom:'8px'}}>Sitemap</h1>
      
      <div style={{display:'grid', gap:'16px'}}>
        <div style={{background:'#f7f7f7', padding:'12px', borderRadius:'10px'}}>
          <h2 style={{fontWeight:'700', marginBottom:'8px', color:'#ff8c00'}}>Main Pages</h2>
          <ul style={{lineHeight:'2', listStyle:'none', padding:0, margin:0}}>
            <li><a href="/" style={{color:'#333', textDecoration:'none'}}>🏠 Home</a></li>
            <li><a href="/category" style={{color:'#333', textDecoration:'none'}}>📚 All Category</a></li>
          </ul>
        </div>

        <div style={{background:'#f7f7f7', padding:'12px', borderRadius:'10px'}}>
          <h2 style={{fontWeight:'700', marginBottom:'8px', color:'#ff8c00'}}>Support Pages</h2>
          <ul style={{lineHeight:'2', listStyle:'none', padding:0, margin:0}}>
            <li><a href="/privacy" style={{color:'#333', textDecoration:'none'}}>🔒 Privacy Policy</a></li>
            <li><a href="/contact" style={{color:'#333', textDecoration:'none'}}>📞 Contact Us</a></li>
            <li><a href="/settings" style={{color:'#333', textDecoration:'none'}}>⚙️ Settings</a></li>
            <li><a href="/sitemap" style={{color:'#333', textDecoration:'none'}}>🗺️ Sitemap</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
