'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Header(){
  const [open,setOpen]=useState(false)

  return(
    <>
      {open && <div className="overlay" onClick={()=>setOpen(false)} onTouchStart={()=>setOpen(false)}></div>}
      <div className="header">
        <Link href="/" className="header-title" onClick={()=>setOpen(false)}>MizoApps</Link>
        <button onClick={()=>setOpen(!open)} className="dot-btn">⋮</button>
      </div>
      {open && (
        <div className="dot-menu">
          <Link href="/" className="menu-item" onClick={()=>setOpen(false)}>
            <span style={{fontSize:'20px'}}>📚</span> <span>Category</span>
          </Link>
          <div className="menu-divider"></div>
          <Link href="/admin" className="menu-item" onClick={()=>setOpen(false)}>
            <span style={{fontSize:'20px'}}>🔐</span> <span>Admin Login</span>
          </Link>
          <div className="menu-divider"></div>
          <Link href="/settings" className="menu-item" onClick={()=>setOpen(false)}>
            <span style={{fontSize:'20px'}}>⚙️</span> <span>Settings</span>
          </Link>
          <div className="menu-divider"></div>
          <Link href="/privacy" className="menu-item" onClick={()=>setOpen(false)}>
            <span style={{fontSize:'20px'}}>🔒</span> <span>Privacy Policy</span>
          </Link>
          <div className="menu-divider"></div>
          <Link href="/contact" className="menu-item" onClick={()=>setOpen(false)}>
            <span style={{fontSize:'20px'}}>📩</span> <span>Contact Us</span>
          </Link>
        </div>
      )}
    </>
  )
}
