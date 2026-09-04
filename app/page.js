'use client'
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
    <h1>MizoApps 📚</h1>
    <p>Mizo thawnthu tha ber</p>
    <div>{cats.map(c=><button key={c} onClick={()=>setCat(c)} className="btn" style={{margin:4,background:cat===c?'#ff6b00':'#ddd',color:cat===c?'white':'black'}}>{c}</button>)}</div>
    {filtered.map(s=><div key={s.id} className="card">
      <Link href={`/story/${s.id}`}><h3>{s.title}</h3><small>{s.category}</small><p>{s.contentMizo?.slice(0,100)}...</p></Link>
    </div>)}
    <Link href="/admin" className="btn">Admin Login</Link>
  </div>)
}
