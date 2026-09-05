'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Link from 'next/link'

export default function StoryPage({params}){
  const [story,setStory]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      try{
        const snap = await getDoc(doc(db,'stories', params.id))
        if(snap.exists()) setStory({id:snap.id, ...snap.data()})
      }catch(e){ console.log(e) }
      setLoading(false)
    }
    load()
  },[params.id])

  if(loading) return <div style={{paddingTop:'80px', textAlign:'center'}}>Loading...</div>
  if(!story) return <div style={{paddingTop:'80px', textAlign:'center'}}>Story hmuh loh a ni</div>

  return(
    <div style={{minHeight:'100vh', background:'#fff', paddingTop:'75px'}}>
      <div style={{padding:'16px', maxWidth:'600px', margin:'0 auto'}}>
        <Link href="/categories" style={{fontSize:'13px', color:'#888', textDecoration:'none'}}>‹ Categories</Link>
        
        <div style={{marginTop:'12px', display:'flex', gap:'6px'}}>
          <span style={{background:'#111', color:'white', padding:'5px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700'}}>{story.category}</span>
          {story.subCategory && <span style={{background:'#ff6b00', color:'white', padding:'5px 12px', borderRadius:'20px', fontSize:'11px', fontWeight:'700'}}>{story.subCategory}</span>}
        </div>

        <h1 style={{fontSize:'24px', fontWeight:'800', margin:'14px 0', lineHeight:'1.3'}}>{story.title}</h1>

        <div style={{background:'#f9f9fb', borderRadius:'16px', padding:'18px', marginTop:'10px', border:'1px solid #eee'}}>
          <div style={{fontSize:'11px', color:'#888', fontWeight:'700', marginBottom:'8px', letterSpacing:'1px'}}>MIZO VERSION</div>
          <div style={{fontSize:'16px', lineHeight:'1.8', whiteSpace:'pre-wrap'}}>{story.contentMizo}</div>
        </div>

        {story.contentEng && (
          <div style={{background:'#fff7ed', borderRadius:'16px', padding:'18px', marginTop:'12px', border:'1px solid #ffedd5'}}>
            <div style={{fontSize:'11px', color:'#ff6b00', fontWeight:'700', marginBottom:'8px', letterSpacing:'1px'}}>ENGLISH</div>
            <div style={{fontSize:'15px', lineHeight:'1.7', whiteSpace:'pre-wrap', color:'#444'}}>{story.contentEng}</div>
          </div>
        )}

        <div style={{marginTop:'20px', textAlign:'center', paddingBottom:'30px'}}>
          <Link href="/categories" style={{display:'inline-block', background:'#111', color:'white', padding:'12px 24px', borderRadius:'12px', textDecoration:'none', fontWeight:'700', fontSize:'13px'}}>‹ Categories ah kir leh</Link>
        </div>
      </div>
    </div>
  )
            }
