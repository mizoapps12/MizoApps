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
  const [total,setTotal]=useState(0)
  const decoded = decodeURIComponent(name)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDocs(collection(db,'stories'))
      const all = snap.docs.map(d=>({id:d.id,...d.data()}))

      // CASE INSENSITIVE a zawng - Love story = Love Story = LOVE STORY
      const decodedLower = decoded.trim().toLowerCase()
      const filtered = all.filter(s=> {
        const cat = (s.category || '').trim().toLowerCase()
        return cat === decodedLower
      })

      setTotal(filtered.length)

      // subCategory, series, sub_category - a awm awm apiang la
      const subs = filtered.map(s=> s.subCategory || s.series || s.sub_category || '').filter(Boolean)
      const unique = [...new Set(subs)]
      setSubCats(unique)
      setLoading(false)
    }
    load()
  },[decoded])

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center', background: dark?'#121212':'#f2f2f7', minHeight:'100vh', color: dark?'#fff':'#111'}}>Loading...</div>

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'70px'}}>
      <div onClick={()=>router.back()} style={{padding:'12px 18px', display:'flex', alignItems:'center', gap:'8px', cursor:'pointer'}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={dark?'white':'black'} strokeWidth="2.5"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        <span style={{fontWeight:'700', color: dark?'white':'black'}}>Back</span>
      </div>

      <div style={{padding:'10px 14px'}}>
        <h2 style={{fontSize:'22px', fontWeight:'800', color: dark?'white':'black', marginBottom:'4px'}}>{decoded}</h2>
        <p style={{color: dark?'#aaa':'#666', fontSize:'13px', marginBottom:'16px'}}>{total} stories • {subCats.length} sub categories</p>

        {subCats.length===0? (
          <div style={{background: dark?'#1e1e1e':'white', padding:'20px', borderRadius:'14px', textAlign:'center', color: dark?'#aaa':'#666'}}>
            Sub Category hmuh loh<br/>
            <span style={{fontSize:'12px'}}>Total stories: {total} - mahse subCategory field a awm lo.<br/>Admin ah subCategory i dah em?</span>
          </div>
        ) : (
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {subCats.map(sc=>(
              <div key={sc} onClick={()=>router.push(`/series/${encodeURIComponent(sc)}`)} style={{background: dark?'#1e1e1e':'white', padding:'18px', borderRadius:'16px', border: dark?'1px solid #333':'1px solid #eee', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontWeight:'700', fontSize:'15px', color: dark?'white':'black'}}>{sc}</span>
                <span style={{color:'#16a34a', fontWeight:'800'}}>→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
                                              }
