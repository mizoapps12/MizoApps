'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header(){
  const [open,setOpen]=useState(false)

  useEffect(()=>{
    const close = () => setOpen(false)
    if(open){
      document.addEventListener('click', close)
      document.addEventListener('touchstart', close)
    }
    return ()=>{
      document.removeEventListener('click', close)
      document.removeEventListener('touchstart', close)
    }
  },[open])

  const stop = (e)=> e.stopPropagation()

  return(
    <>
      {open && <div className="overlay" onClick={()=>setOpen(false)}></div>}
      <div className="header" onClick={stop} onTouchStart={stop}>
        <Link href="/" className="header-title" onClick={()=>setOpen(false)}>MizoApps</Link>
        <div style={{position:'relative'}}>
          <button onClick={(e)=>{e.stopPropagation(); setOpen(!open)}} className="dot-btn">⋮</button>
          {open && (
            <div className="dot-menu" onClick={stop}>
              <Link href="/" className="menu-item" onClick={()=>setOpen(false)}>📚 Category</Link>
              <div className="menu-divider"></div>
              <Link href="/admin" className="menu-item" onClick={()=>setOpen(false)}>🔐 Admin Login</Link>
              <div className="menu-divider"></div>
              <Link href="/settings" className="menu-item" onClick={()=>setOpen(false)}>⚙️ Settings</Link>
              <div className="menu-divider"></div>
              <Link href="/privacy" className="menu-item" onClick={()=>setOpen(false)}>🔒 Privacy Policy</Link>
              <div className="menu-divider"></div>
              <Link href="/contact" className="menu-item" onClick={()=>setOpen(false)}>📩 Contact Us</Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
