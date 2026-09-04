'use client'
import { createContext, useContext, useEffect, useState } from 'react'
const SettingsContext = createContext()
export function SettingsProvider({ children }){
  const [darkMode, setDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  useEffect(()=>{
    const d = localStorage.getItem('darkMode') === 'true'
    const f = parseInt(localStorage.getItem('fontSize') || '16')
    setDarkMode(d); setFontSize(f)
  },[])
  useEffect(()=>{
    localStorage.setItem('darkMode', darkMode)
    localStorage.setItem('fontSize', fontSize)
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    document.body.style.fontSize = fontSize + 'px'
  },[darkMode, fontSize])
  return <SettingsContext.Provider value={{darkMode,setDarkMode,fontSize,setFontSize}}>{children}</SettingsContext.Provider>
}
export const useSettings = () => useContext(SettingsContext)
