'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'
import { useSettings } from '../../components/SettingsContext'

export default function CategoryPage(){
  const {name} = useParams()
  const router = useRouter()
  const {dark} = useSettings()
  const [subCats,setSubCats]=useState([])
  const [loading,setLoading]=useState(true)
  const decoded = decodeURIComponent(name)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDocs(collection(db,'stories'))
      const all = snap.docs.map(d=>({id:d.id,...d.data()}))
      const decodedLower = decoded.trim().toLowerCase()
      const filtered = all.filter(s=> (s.category || '').trim().toLowerCase() === decodedLower)
      const map = {}
      filtered.forEach(s=>{
        const sc = s.subCategory || s.series || s.sub_category || ''
        if(!sc) return
        map[sc] = (map[sc] || 0) + 1
      })
      setSubCats(Object.keys(map).map(k=>({name:k, count:map[k]})))
      setLoading(false)
    }
    load()
  },[decoded])

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center', minHeight:'100vh'}}>Loading...</div>

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'70px'}}>

      {/* ARROW + LOVE STORY - BACK AWM LO */}
      <div onClick={()=>router.back()} style={{padding:'14px', display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={dark?'white':'black'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
        <span style={{fontSize:'20px', fontWeight:'800', color: dark?'white':'black'}}>{decoded}</span>
      </div>

      <div style={{padding:'10px 14px'}}>
        <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'6px'}}>
          {subCats.map(sc=>(
            <div key={sc.name} onClick={()=>router.push(`/series/${encodeURIComponent(sc.name)}`)} style={{background: dark?'#1e1e1e':'white', padding:'18px', borderRadius:'16px', border: dark?'1px solid #333':'1px solid #eee', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span style={{fontWeight:'700', fontSize:'15px', color: dark?'white':'black'}}>{sc.name}</span>
              <span style={{background:'#16a34a', color:'white', fontSize:'13px', fontWeight:'800', padding:'5px 12px', borderRadius:'20px'}}>
                ({sc.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
