export default function Footer(){
  return(
    <footer style={{background:'#121212', borderTop:'2.5px solid #ff8c00', padding:'18px 14px', marginTop:'30px'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto', textAlign:'center'}}>
        
        {/* Logo */}
        <div style={{marginBottom:'10px'}}>
          <span style={{color:'#ff8c00', fontStyle:'italic', fontWeight:'800', fontSize:'20px'}}>Mizo</span>
          <span style={{color:'#ffffff', fontWeight:'900', fontSize:'20px'}}>Apps</span>
        </div>

        {/* Links */}
        <div style={{display:'flex', justifyContent:'center', gap:'16px', flexWrap:'wrap', marginBottom:'12px'}}>
          <a href="/privacy" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Privacy</a>
          <a href="/contact" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Contact</a>
          <a href="/category" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Category</a>
          <a href="/settings" style={{color:'#aaa', textDecoration:'none', fontSize:'13px'}}>Settings</a>
        </div>

        {/* Copyright */}
        <div style={{color:'#666', fontSize:'12px', lineHeight:'1.4'}}>
          © 2026 MizoApps.in - Mizo Apps & Games te awlsam taka download na<br/>
          Made with ❤️ for Mizo People
        </div>

      </div>
    </footer>
  )
}
