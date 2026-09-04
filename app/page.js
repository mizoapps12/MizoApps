'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'

export default function Home(){
  const [stories,setStories]=useState([])
  useEffect(()=>{
    const fetchData=async()=>{
      const q=query(collection(db,'stories'),orderBy('createdAt','desc'))
      const snap=await getDocs(q)
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
    }
    fetchData()
  },[])

  return(
    <div className="container">
      <h2 style={{marginTop:'10px', fontWeight:'800'}}>Mizo thawnthu tha ber</h2>
      {stories.length===0 && <p style={{textAlign:'center',marginTop:'40px',color:'#888'}}>Thawnthu a la awm lo...</p>}
      {stories.map(s=><div key={s.id} className="card">
        <Link href={`/story/${s.id}`} style={{textDecoration:'none'}}>
          <small style={{color:'#888', fontWeight:'bold'}}>{s.category}</small>
          <h3 style={{color:'#6b21a8', margin:'8px 0'}}>{s.title}</h3>
          <p style={{color:'#6b21a8'}}>{s.contentMizo?.slice(0,120)}...</p>
        </Link>
      </div>)}
    </div>
  )
}
