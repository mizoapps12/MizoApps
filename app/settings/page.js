'use client'
import { useSettings } from '../components/SettingsContext'

export default function Settings(){
  const {darkMode,setDarkMode,fontSize,setFontSize}=useSettings()
  return(
    <div className="container">
      <h2>⚙️ Settings</h2>
      <div className="card">
        <h3>Dark Mode</h3>
        <button className="btn" onClick={()=>setDarkMode(!darkMode)}>{darkMode?'☀️ Light Mode ah thlak':'🌙 Dark Mode ah thlak'}</button>
      </div>
      <div className="card">
        <h3>Font Size - Site pumpui control</h3>
        <p>Size: {fontSize}px</p>
        <input type="range" min="14" max="26" value={fontSize} onChange={e=>setFontSize(e.target.value)} style={{width:'100%'}}/>
        <div style={{display:'flex',gap:'10px',marginTop:'10px'}}>
          <button className="btn" onClick={()=>setFontSize(14)}>Tawi</button>
          <button className="btn" onClick={()=>setFontSize(16)}>Normal</button>
          <button className="btn" onClick={()=>setFontSize(20)}>Lian</button>
          <button className="btn" onClick={()=>setFontSize(24)}>Lian Bawp</button>
        </div>
        <p style={{marginTop:'20px',fontSize:fontSize}}>Entirna: Hei hi Mizo thawnthu chhiarna tur a ni. {fontSize}px ah a lang ang.</p>
      </div>
    </div>
  )
  }
