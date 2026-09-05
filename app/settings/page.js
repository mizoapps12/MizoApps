'use client'
import { useState, useEffect } from 'react'

export default function SettingsPage(){
  const [dark,setDark]=useState(false)
  const [fontSize,setFontSize]=useState(16)

  useEffect(()=>{
    const t = localStorage.getItem('theme')
    const f = localStorage.getItem('siteFontSize')
    if(t==='dark') setDark(true)
    if(f) setFontSize(parseInt(f))
  },[])

  const toggleDark=()=>{
    const newMode = !dark
    setDark(newMode)
    localStorage.setItem('theme', newMode?'dark':'light')
    if(newMode) document.documentElement.classList.add('dark-mode')
    else document.documentElement.classList.remove('dark-mode')
    window.dispatchEvent(new Event('themeChange'))
  }

  const changeFont=(size)=>{
    setFontSize(size)
    localStorage.setItem('siteFontSize', size)
    document.documentElement.style.fontSize = size+'px'
    window.dispatchEvent(new Event('fontChange'))
  }

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'75px', transition:'0.3s'}}>
      <div style={{maxWidth:'600px', margin:'0 auto', padding:'16px'}}>
        <h1 style={{fontSize:'28px', fontWeight:'900', color: dark?'white':'#111'}}>Settings</h1>
        <p style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>I duh dan in siam rem rawh</p>

        {/* APPEARANCE */}
        <div style={{marginTop:'20px'}}>
          <div style={{fontSize:'11px', fontWeight:'800', letterSpacing:'1.2px', color:'#888', margin:'0 0 8px 6px'}}>APPEARANCE</div>
          
          <div style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', border:`1px solid ${dark?'#333':'#eee'}`, overflow:'hidden'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'12px', background: dark?'#333':'#f2f2f7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>{dark?'🌙':'☀️'}</div>
                <div>
                  <div style={{fontWeight:'700', color: dark?'white':'#111'}}>Dark Mode</div>
                  <div style={{fontSize:'11px', color:'#888'}}>{dark?'Dark a ni mek':'Light a ni mek'}</div>
                </div>
              </div>
              <div onClick={toggleDark} style={{width:'52px', height:'32px', borderRadius:'16px', background: dark?'#ff6b00':'#e5e5e7', position:'relative', cursor:'pointer', transition:'0.3s'}}>
                <div style={{width:'28px', height:'28px', borderRadius:'50%', background:'white', position:'absolute', top:'2px', left: dark?'22px':'2px', transition:'0.3s', boxShadow:'0 2px 6px rgba(0,0,0,0.2)'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* TYPOGRAPHY */}
        <div style={{marginTop:'22px'}}>
          <div style={{fontSize:'11px', fontWeight:'800', letterSpacing:'1.2px', color:'#888', margin:'0 0 8px 6px'}}>TYPOGRAPHY</div>
          
          <div style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', border:`1px solid ${dark?'#333':'#eee'}`, padding:'18px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px'}}>
              <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <div style={{width:'40px', height:'40px', borderRadius:'12px', background: dark?'#333':'#f2f2f7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>Aa</div>
                <div>
                  <div style={{fontWeight:'700', color: dark?'white':'#111'}}>Font Size</div>
                  <div style={{fontSize:'11px', color:'#888'}}>Site pumpui huam</div>
                </div>
              </div>
              <div style={{background:'#ff6b00', color:'white', padding:'6px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'800'}}>{fontSize}px</div>
            </div>

            <input type="range" min="12" max="24" value={fontSize} onChange={(e)=>changeFont(parseInt(e.target.value))} style={{width:'100%', accentColor:'#ff6b00', height:'6px'}}/>

            <div style={{display:'flex', justifyContent:'space-between', marginTop:'8px'}}>
              <span style={{fontSize:'11px', color:'#888'}}>Te (12)</span>
              <span style={{fontSize:'11px', color:'#888'}}>Lian (24)</span>
            </div>

            <div style={{marginTop:'18px', background: dark?'#2a2a2a':'#f9f9fb', borderRadius:'12px', padding:'14px', border:`1px dashed ${dark?'#444':'#ddd'}`}}>
              <div style={{fontSize:`${fontSize}px`, color: dark?'#ddd':'#111', lineHeight:'1.7'}}>
                Hei hi entirna a ni. Mizo thu i chhiar dawn a, hetiang hian a lang ang.
              </div>
              <div style={{fontSize:`${fontSize-2}px`, color:'#888', marginTop:'6px'}}>Preview - {fontSize}px ah i dah mek</div>
            </div>
          </div>
        </div>

        <div style={{textAlign:'center', marginTop:'30px', color:'#888', fontSize:'11px'}}>
          MizoApps v1.0 • Settings auto save a ni
        </div>
      </div>
    </div>
  )
          }
