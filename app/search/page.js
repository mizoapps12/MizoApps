'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'

export default function SearchPage(){
  const [stories,setStories]=useState([])
  const [qText,setQText]=useState('')

  useEffect(()=>{
    const fetchData=async()=>{
      const q=query(collection(db,'stories'),orderBy('createdAt','desc'))
      const snap=await getDocs(q)
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
    }
    fetchData()
  },[])

  const filtered=stories.filter(s=>{
    const t=(qText||'').toLowerCase()
    return s.title?.toLowerCase().includes(t) || s.contentMizo?.toLowerCase().includes(t) || s.category?.toLowerCase().includes(t)
  })

  return(
    <div className="container">
      <h2 style={{fontWeight:'800'}}>🔍 Search</h2>
      <div style={{margin:'15px 0'}}>
        <input 
          type="text" 
          placeholder="Thawnthu zawng rawh..." 
          value={qText} 
          onChange={e=>setQText(e.target.value)}
          style={{width:'100%', padding:'14px 16px', borderRadius:'12px', border:'1px solid #ddd', fontSize:'16px', outline:'none'}}
          autoFocus
        />
      </div>
      {qText && <p style={{color:'#888', marginBottom:'10px'}}>{filtered.length} result hmuh a ni</p>}
      {filtered.map(s=><div key={s.id} className="card">
        <Link href={`/story/${s.id}`} style={{textDecoration:'none'}}>
          <small style={{color:'#888',fontWeight:'bold'}}>{s.category}</small>
          <h3 style={{color:'#6b21a8',margin:'8px 0'}}>{s.title}</h3>
          <p style={{color:'#6b21a8'}}>{s.contentMizo?.slice(0,120)}...</p>
        </Link>
      </div>)}
      {qText && filtered.length===0 && <p style={{textAlign:'center', marginTop:'40px', color:'#888'}}>A awm lo - a dang zawng leh rawh</p>}
    </div>
  )
}
