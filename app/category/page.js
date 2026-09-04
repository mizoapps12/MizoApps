'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'

export default function CategoryPage(){
  const [stories,setStories]=useState([])
  const [cat,setCat]=useState('all')

  useEffect(()=>{
    const fetchData=async()=>{
      const q=query(collection(db,'stories'),orderBy('createdAt','desc'))
      const snap=await getDocs(q)
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
    }
    fetchData()
  },[])

  const cats=['all','Hmangaihna','Hlauhawm','Naupang','English Lehlin','Tawi Tawi']
  const filtered=cat==='all'?stories:stories.filter(s=>s.category===cat)

  return(
    <div className="container">
      <h2 style={{fontWeight:'800'}}>📚 Category</h2>
      <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'20px',marginTop:'15px'}}>
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:'10px 18px', borderRadius:'12px', border:'none', fontWeight:'700', background:cat===c?'#ff6b00':'#e5e7eb', color:cat===c?'white':'#111', cursor:'pointer'}}>{c}</button>)}
      </div>
      {filtered.map(s=><div key={s.id} className="card">
        <Link href={`/story/${s.id}`} style={{textDecoration:'none'}}>
          <small style={{color:'#888',fontWeight:'bold'}}>{s.category}</small>
          <h3 style={{color:'#6b21a8',margin:'8px 0'}}>{s.title}</h3>
          <p style={{color:'#6b21a8'}}>{s.contentMizo?.slice(0,120)}...</p>
        </Link>
      </div>)}
      {filtered.length===0 && <p style={{textAlign:'center',marginTop:'40px'}}>He category ah hian thawnthu a awm lo.</p>}
    </div>
  )
        }
