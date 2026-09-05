'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useSettings } from '../components/SettingsContext'

export default function CategoryListPage(){
  const {dark} = useSettings()
  const router = useRouter()
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const load = async()=>{
      const snap = await getDocs(collection(db,'stories'))
      const stories = snap.docs.map(d=>d.data())

      // Admin map la
      const mapSnap = await getDocs(collection(db,'categoryMap'))
      const catMap = {}
      mapSnap.docs.forEach(d=>{
        const data = d.data()
        catMap[data.original.trim().toLowerCase()] = data.display
      })

      const map = {}
      stories.forEach(s=>{
        if(!s.category) return
        const orig = s.category
        const display = catMap[orig.trim().toLowerCase()] || orig
        map[display] = (map[display] || 0) + 1
      })
      setCats(Object.keys(map).map(name=>({name, count: map[name]})))
      setLoading(false)
    }
    load()
  },[])

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center'}}>Loading...</div>

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'70px', padding:'16px'}}>
      <h2 style={{fontWeight:'900', fontSize:'22px', color: dark?'white':'black', marginBottom:'16px'}}>Categories</h2>
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {cats.map(c=>(
          <div key={c.name} onClick={()=>router.push(`/category/${encodeURIComponent(c.name)}`)} style={{background: dark?'#1e1e1e':'white', padding:'18px', borderRadius:'16px', border: dark?'1px solid #333':'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}}>
            <span style={{fontWeight:'800', fontSize:'16px', color: dark?'white':'black'}}>{c.name}</span>
            <span style={{background:'#16a34a', color:'white', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:'800'}}>{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
                         }
