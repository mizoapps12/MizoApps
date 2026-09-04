'use client'
import { useState } from 'react'
import Link from 'next/link'
export default function Header(){
  const [open,setOpen]=useState(false)
  return(
    <div className="header">
      <Link href="/" style={{fontSize:'28px',fontWeight:'bold',color:'var(--text)',textDecoration:'none'}}>MizoApps</Link>
      <div style={{position:'relative'}}>
        <button onClick={()=>setOpen(!open)} style={{background:'none',border:'none',fontSize:'28px',fontWeight:'bold',cursor:'pointer',color:'var(--text)'}}>⋮</button>
        {open && (
          <div className="dot-menu">
            <Link href="/" onClick={()=>setOpen(false)}>📂 Category</Link>
            <Link href="/admin" onClick={()=>setOpen(false)}>🔐 Admin Login</Link>
            <Link href="/settings" onClick={()=>setOpen(false)}>⚙️ Settings</Link>
          </div>
        )}
      </div>
    </div>
  )
}
