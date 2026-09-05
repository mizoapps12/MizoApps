'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function StoryPage({params}){
  const [story,setStory]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDoc(doc(db,'stories', params.id))
      if(snap.exists()) setStory({id:snap.id, ...snap.data()})
      setLoading(false)
    }
    load()
  },[params.id])

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center'}}>Loading...</div>
  if(!story) return <div style={{paddingTop:'90px', textAlign:'center'}}>Story hmuh loh</div>

  // Content a TITLE: lo awm sa kha paih bo - a pahnih awm loh nan
  const cleanContent = story.contentMizo
    ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim()
    : ''

  return(
    <div style={{minHeight:'100vh', background:'#f2f2f7', paddingTop:'70px'}}>
      <div onClick={()=>window.history.back()} style={{display:'flex', alignItems:'center', gap:'8px', padding:'12px 18px', cursor:'pointer'}}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        <span style={{fontSize:'18px', fontWeight:'700'}}>Back</span>
      </div>

      <div style={{padding:'10px 14px 30px 14px'}}>
        <div style={{background:'white', borderRadius:'18px', padding:'20px', border:'1px solid #e5e5e5'}}>
          {/* TITLE leh Title pakhat zawn ah */}
          <div style={{fontSize:'16px', fontWeight:'800', marginBottom:'22px'}}>
            TITLE: {story.title}
          </div>
          
          <div style={{fontSize:'16px', lineHeight:'1.9', whiteSpace:'pre-wrap', color:'#111'}}>
            {cleanContent}
          </div>

          {story.contentEng && (
            <div style={{marginTop:'24px', paddingTop:'16px', borderTop:'1px solid #eee', fontSize:'15px', lineHeight:'1.7', whiteSpace:'pre-wrap', color:'#555'}}>
              {story.contentEng}
            </div>
          )}
        </div>
      </div>
    </div>
  )
    }
