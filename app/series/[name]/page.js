'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { useParams, useRouter } from 'next/navigation'

export default function SeriesPage(){
  const {name} = useParams()
  const router = useRouter()
  const [stories,setStories]=useState([])
  const decoded = decodeURIComponent(name)

  useEffect(()=>{
    const load=async()=>{
      // i field hming azir in 'series' emaw 'subCategory' emaw
      const q = query(collection(db,'stories'), where('series','==', decoded), orderBy('createdAt','desc'))
      const snap = await getDocs(q)
      let data = snap.docs.map(d=>({id:d.id,...d.data()}))
      if(data.length===0){
        const q2 = query(collection(db,'stories'), where('subCategory','==', decoded), orderBy('createdAt','desc'))
        const snap2 = await getDocs(q2)
        data = snap2.docs.map(d=>({id:d.id,...d.data()}))
      }
      setStories(data)
    }
    load()
  },[decoded])

  return(
    <div style={{paddingTop:'80px', padding:'80px 14px'}}>
      <h2 style={{fontWeight:'800', fontSize:'20px', marginBottom:'12px'}}>{decoded}</h2>
      <p style={{color:'#666', marginBottom:'12px'}}>{stories.length} bung awm</p>
      {stories.map(s=>(
        <div key={s.id} onClick={()=>router.push(`/story/${s.id}`)} style={{background:'white', padding:'14px', borderRadius:'14px', marginBottom:'10px', cursor:'pointer'}}>
          <b>{s.title}</b>
          <div style={{fontSize:'13px', color:'#666'}}>{s.contentMizo?.substring(0,80)}...</div>
        </div>
      ))}
    </div>
  )
        }
