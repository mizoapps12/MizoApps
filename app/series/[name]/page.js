'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'
import { useSettings } from '../../components/SettingsContext'

function timeAgo(timestamp){
  if(!timestamp) return ''
  const now = new Date()
  const time = timestamp.toDate? timestamp.toDate() : new Date(timestamp)
  const diff = Math.floor((now - time)/1000)
  if(diff < 60) return 'Just now'
  if(diff < 3600) return `${Math.floor(diff/60)}m ago`
  if(diff < 86400) return `${Math.floor(diff/3600)}h ago`
  if(diff < 2592000) return `${Math.floor(diff/86400)}d ago`
  return time.toLocaleDateString()
}

export default function SeriesPage(){
  const {name} = useParams()
  const router = useRouter()
  const {dark, fontSize} = useSettings()
  const [stories,setStories]=useState([])
  const [loading,setLoading]=useState(true)
  const decoded = decodeURIComponent(name)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDocs(collection(db,'stories'))
      const all = snap.docs.map(d=>({id:d.id,...d.data()}))
      const filtered = all.filter(s=> (s.subCategory === decoded || s.series === decoded || s.sub_category === decoded))

      // Bung number azir in sort - 1,2,3...
      filtered.sort((a,b)=>{
        const getNum = (t)=>{ const m = (t||'').match(/Bung\s*(\d+)/i); return m? parseInt(m[1]):0 }
        return getNum(a.title) - getNum(b.title)
      })
      setStories(filtered)
      setLoading(false)
    }
    load()
  },[decoded])

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center', background: dark?'#121212':'#f2f2f7', minHeight:'100vh', color: dark?'#fff':'#111'}}>Loading...</div>

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'70px'}}>

      {/* ARROW LIAN + TITLE - BACK PAIH */}
      <div style={{padding:'16px 14px 6px 14px', display:'flex', alignItems:'center', gap:'12px'}}>
        <div onClick={()=>router.back()} style={{cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', width:'36px', height:'36px', borderRadius:'50%', background: dark?'#2a2a2a':'white', border: dark?'1px solid #444':'1px solid #ddd'}}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dark?'white':'black'} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
          </svg>
        </div>
        <div>
          <h2 style={{fontSize:'20px', fontWeight:'800', color: dark?'white':'black', lineHeight:'1.2'}}>{decoded}</h2>
          <p style={{color: dark?'#aaa':'#666', fontSize:'12px', marginTop:'2px'}}>{stories.length} bung awm</p>
        </div>
      </div>

      <div style={{padding:'10px 14px'}}>
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          {stories.map(s=>{
            const preview = s.contentMizo? s.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim().substring(0,100) : ''
            return(
              <div key={s.id} onClick={()=>router.push(`/story/${s.id}`)} style={{background: dark?'#1e1e1e':'white', padding:'16px', borderRadius:'16px', border: dark?'1px solid #333':'1px solid #eee', cursor:'pointer'}}>
                <div style={{fontSize: `${fontSize+1}px`, fontWeight:'800', color: dark?'white':'black', marginBottom:'6px'}}>{s.title}</div>
                <div style={{fontSize:'13px', color: dark?'#aaa':'#555', lineHeight:'1.5'}}>{preview}...</div>
                <div style={{fontSize:'11px', color: dark?'#777':'#999', marginTop:'6px'}}>{timeAgo(s.createdAt)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
            }
