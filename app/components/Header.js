'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Header(){
  const [open,setOpen]=useState(false)
  return(
    <>
      <div className="header" style={{padding:'10px 14px', background:'#121212', borderBottom:'2.5px solid #ff8c00'}}>
        <Link href="/" className="header-logo" onClick={()=>setOpen(false)}>
          <span style={{color:'#ff8c00', fontStyle:'italic', fontWeight:'800'}}>Mizo</span>
          <span style={{color:'#ffffff', fontWeight:'900'}}>Apps</span>
        </Link>
        <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
          <Link href="/search" style={{textDecoration:'none', padding:'8px', display:'flex'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6"></circle>
              <line x1="21" y1="21" x2="17" y2="17"></line>
            </svg>
          </Link>
          <button onClick={()=>setOpen(!open)} className="dot-btn" style={{background:'transparent', border:'none', cursor:'pointer', padding:'8px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {open ? (
              // X Icon
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              // Hamburger Icon
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="overlay" onClick={()=>setOpen(false)}></div>
          <div className="dot-menu">
            <Link href="/category" className="menu-item" onClick={()=>setOpen(false)}><span>📚</span><span>Category</span></Link>
            <div className="menu-divider"></div>
            <Link href="/admin" className="menu-item" onClick={()=>setOpen(false)}><span>🔐</span><span>Admin Login</span></Link>
            <div className="menu-divider"></div>
            <Link href="/settings" className="menu-item" onClick={()=>setOpen(false)}><span>⚙️</span><span>Settings</span></Link>
            <div className="menu-divider"></div>
            <Link href="/privacy" className="menu-item" onClick={()=>setOpen(false)}><span>🔒</span><span>Privacy Policy</span></Link>
            <div className="menu-divider"></div>
            <Link href="/contact" className="menu-item" onClick={()=>setOpen(false)}><span>📩</span><span>Contact Us</span></Link>
          </div>
        </>
      )}
    </>
  )
        }
