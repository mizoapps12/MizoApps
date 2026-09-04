'use client'
import { useEffect,useState } from 'react'
import { db } from '@/lib/firebase'
import { doc,getDoc } from 'firebase/firestore'
export default function Story({params}){
  const [s,setS]=useState(null)
  useEffect(()=>{(async()=>{const snap=await getDoc(doc(db,'stories',params.id));if(snap.exists())setS(snap.data())})()},[params.id])
  if(!s) return <p>Loading...</p>
  return(<div className="container"><div className="card"><h1>{s.title}</h1><small>{s.category}</small><hr/><p style={{whiteSpace:'pre-wrap',lineHeight:1.7}}>{s.contentMizo}</p>{s.contentEng && <><hr/><h4>English Original</h4><p>{s.contentEng}</p></>}</div></div>)
}
