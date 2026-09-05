'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({children}){
  const [dark,setDark]=useState(false)
  const [fontSize,setFontSize]=useState(16)

  useEffect(()=>{
    const t = localStorage.getItem('theme')
    const f = localStorage.getItem('siteFontSize')
    if(t==='dark'){
      setDark(true)
      document.documentElement.classList.add('dark-mode')
    }
    if(f){
      const s = parseInt(f)
      setFontSize(s)
      document.documentElement.style.fontSize = s+'px'
    }
  },[])

  const toggleDark=()=>{
    const newDark = !dark
    setDark(newDark)
    localStorage.setItem('theme', newDark?'dark':'light')
    if(newDark) document.documentElement.classList.add('dark-mode')
    else document.documentElement.classList.remove('dark-mode')
  }

  const changeFont=(size)=>{
    setFontSize(size)
    localStorage.setItem('siteFontSize', size)
    document.documentElement.style.fontSize = size+'px'
  }

  return(
    <SettingsContext.Provider value={{dark, fontSize, toggleDark, changeFont}}>
      <div style={{fontSize: fontSize+'px'}} className={dark?'dark-active':''}>
        {children}
      </div>
    </SettingsContext.Provider>
  )
}

export const useSettings=()=>useContext(SettingsContext)
