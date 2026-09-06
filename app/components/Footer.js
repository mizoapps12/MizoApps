export default function Footer(){
  return(
    <footer style={{background:'#121212', borderTop:'2.5px solid #ff8c00', padding:'14px 14px', marginTop:'10px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto', textAlign:'center'}}>
        <div style={{marginBottom:'8px'}}>
          <span style={{color:'#ff8c00', fontStyle:'italic', fontWeight:'800', fontSize:'20px'}}>Mizo</span>
          <span style={{color:'#ffffff', fontWeight:'900', fontSize:'20px'}}>Apps</span>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:'14px', flexWrap:'wrap', marginBottom:'8px'}}>
          <a href="/privacy" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Privacy</a>
          <a href="/contact" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Contact</a>
          <a href="/category" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Category</a>
          <a href="/sitemap" style={{color:'#ff8c00', textDecoration:'none', fontSize:'13px', fontWeight:'700'}}>Sitemap</a>
          <a href="/settings" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Settings</a>
        </div>
        <div style={{color:'#666', fontSize:'12px', lineHeight:'1.4'}}>
          © 2026 MizoApps.in - Mizo thawnthu & English Story Mizo tawnga chhiarna hmunpui<br/>
          Made with ❤️ for Mizo People
        </div>
      </div>
    </footer>
  )
            }
