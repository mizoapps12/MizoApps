'use client'
import { useSettings } from '../components/SettingsContext'

export default function SettingsPage(){
  const {dark, fontSize, toggleDark, changeFont} = useSettings()

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'75px', transition:'0.3s'}}>
      <div style={{maxWidth:'600px', margin:'0 auto', padding:'16px'}}>
        <h1 style={{fontSize:'28px', fontWeight:'900', color: dark?'white':'#111'}}>Settings</h1>
        <p style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>Site pumpui i control theih</p>

        <div style={{marginTop:'20px'}}>
          <div style={{fontSize:'11px', fontWeight:'800', letterSpacing:'1.2px', color:'#888', margin:'0 0 8px 6px'}}>APPEARANCE</div>
          <div style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', border:`1px solid ${dark?'#333':'#eee'}`, overflow:'hidden'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'12px', background: dark?'#333':'#f2f2f7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>{dark?'🌙':'☀️'}</div>
                <div>
                  <div style={{fontWeight:'700', color: dark?'white':'#111'}}>Dark Mode</div>
                  <div style={{fontSize:'11px', color:'#888'}}>{dark?'Dark Mode ON':'Light Mode'}</div>
                </div>
              </div>
              <div onClick={toggleDark} style={{width:'52px', height:'32px', borderRadius:'16px', background: dark?'#ff6b00':'#e5e5e7', position:'relative', cursor:'pointer', transition:'0.3s'}}>
                <div style={{width:'28px', height:'28px', borderRadius:'50%', background:'white', position:'absolute', top:'2px', left: dark?'22px':'2px', transition:'0.3s', boxShadow:'0 2px 6px rgba(0,0,0,0.2)'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop:'22px'}}>
          <div style={{fontSize:'11px', fontWeight:'800', letterSpacing:'1.2px', color:'#888', margin:'0 0 8px 6px'}}>TYPOGRAPHY - SITE PUMPUI</div>
          <div style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', border:`1px solid ${dark?'#333':'#eee'}`, padding:'18px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
              <div style={{fontWeight:'700', color: dark?'white':'#111'}}>Font Size - {fontSize}px</div>
              <div style={{background:'#ff6b00', color:'white', padding:'5px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'800'}}>{fontSize}px</div>
            </div>
            <input type="range" min="12" max="26" value={fontSize} onChange={(e)=>changeFont(parseInt(e.target.value))} style={{width:'100%', accentColor:'#ff6b00'}}/>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:'6px', fontSize:'11px', color:'#888'}}>
              <span>Te</span><span>Lian</span>
            </div>
            <div style={{marginTop:'16px', background: dark?'#2a2a2a':'#f9f9fb', padding:'14px', borderRadius:'12px', border:`1px dashed ${dark?'#444':'#ddd'}`}}>
              <div style={{fontSize: fontSize+'px', color: dark?'#ddd':'#111', lineHeight:'1.7'}}>
                Hei hi Preview a ni - Site pumpui ah hetiang hian a lang ang. Mizo thu i chhiar na ah pawh.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
