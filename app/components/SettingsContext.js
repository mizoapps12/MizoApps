'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({children}){
  const [dark,setDark]=useState(false)
  const [fontSize,setFontSize]=useState(16)

  // Load on start
  useEffect(()=>{
    const t = localStorage.getItem('theme')
    const f = localStorage.getItem('siteFontSize')
    
    if(t==='dark'){
      setDark(true)
      document.documentElement.classList.add('dark-mode')
      document.documentElement.setAttribute('data-theme','dark')
      document.body.style.backgroundColor = '#121212'
    } else {
      document.documentElement.setAttribute('data-theme','light')
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
    
    if(newDark){
      document.documentElement.classList.add('dark-mode')
      document.documentElement.setAttribute('data-theme','dark')
      document.body.style.backgroundColor = '#121212'
      document.body.style.color = '#f0f0f0'
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.setAttribute('data-theme','light')
      document.body.style.backgroundColor = '#e8e8ec'
      document.body.style.color = '#1a1a1a'
    }
  }

  const changeFont=(size)=>{
    setFontSize(size)
    localStorage.setItem('siteFontSize', size)
    document.documentElement.style.fontSize = size+'px'
  }

  return(
    <SettingsContext.Provider value={{dark, fontSize, toggleDark, changeFont}}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings=()=>useContext(SettingsContext)
