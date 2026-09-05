'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'

export default function CategoryPage(){
  const {name} = useParams()
  const router = useRouter()
  const [stories,setStories]=useState([])
  const decoded = decodeURIComponent(name)

  useEffect(()=>{
    const load=async()=>{
      const q = query(collection(db,'stories'), where('category','==', decoded), orderBy('createdAt','desc'))
      const snap = await getDocs(q)
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
    }
    load()
  },[decoded])

  return(
    <div style={{paddingTop:'80px', padding:'80px 14px'}}>
      <h2 style={{fontWeight:'800', fontSize:'20px', marginBottom:'12px'}}>{decoded}</h2>
      {stories.map(s=>(
        <div key={s.id} onClick={()=>router.push(`/story/${s.id}`)} style={{background:'white', padding:'14px', borderRadius:'14px', marginBottom:'10px', cursor:'pointer'}}>
          <b>{s.title}</b>
        </div>
      ))}
    </div>
  )
}
