'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'

export default function Home(){
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
  return(<div className="container">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <h1>MizoApps 📚</h1>
      <Link href="/admin" className="btn">Admin Login</Link>
    </div>
    <p>Mizo thawnthu tha ber</p>
    <div style={{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'20px'}}>
      {cats.map(c=><button key={c} onClick={()=>setCat(c)} className="btn" style={{background:cat===c?'#ff6b00':'#e5e7eb',color:cat===c?'white':'black'}}>{c}</button>)}
    </div>
    {filtered.length===0 && <p style={{textAlign:'center',marginTop:'40px',color:'#888'}}>Thawnthu a la awm lo - Admin atangin publish rawh!</p>}
    {filtered.map(s=><div key={s.id} className="card">
      <Link href={`/story/${s.id}`}><h3>{s.title}</h3><small>{s.category}</small><p>{s.contentMizo?.slice(0,100)}...</p></Link>
    </div>)}
  </div>)
      }
