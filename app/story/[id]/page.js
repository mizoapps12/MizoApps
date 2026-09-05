'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useSettings } from '../../components/SettingsContext'

function timeAgo(timestamp){
  if(!timestamp) return ''
  const now = new Date()
  const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const diff = Math.floor((now - time)/1000)
  if(diff < 60) return 'Just now'
  if(diff < 3600) return `${Math.floor(diff/60)} min ago`
  if(diff < 86400) return `${Math.floor(diff/3600)} hrs ago`
  if(diff < 2592000) return `${Math.floor(diff/86400)} days ago`
  return time.toLocaleDateString()
}

export default function StoryPage({params}){
  const {dark, fontSize} = useSettings()
  const [story,setStory]=useState(null)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDoc(doc(db,'stories', params.id))
      if(snap.exists()) setStory({id:snap.id, ...snap.data()})
      setLoading(false)
    }
    load()
  },[params.id])

  if(loading) return <div style={{paddingTop:'90px', textAlign:'center', background: dark?'#121212':'#f2f2f7', color: dark?'#fff':'#111', minHeight:'100vh'}}>Loading...</div>
  if(!story) return <div style={{paddingTop:'90px', textAlign:'center', background: dark?'#121212':'#f2f2f7', color: dark?'#fff':'#111', minHeight:'100vh'}}>Story hmuh loh</div>

  const cleanContent = story.contentMizo ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim() : ''

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'70px', transition:'background 0.3s'}}>
      <div onClick={()=>window.history.back()} style={{display:'flex', alignItems:'center', gap:'8px', padding:'12px 18px', cursor:'pointer', position:'sticky', top:'70px', zIndex:10, background: dark?'#121212':'#f2f2f7'}}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dark?'white':'black'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
        </svg>
        <span style={{fontSize:'18px', fontWeight:'700', color: dark?'white':'black'}}>Back</span>
      </div>

      <div style={{padding:'10px 14px 30px 14px'}}>
        <div style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', padding:'20px', border: dark?'1px solid #333':'1px solid #e5e5e5'}}>
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px', marginBottom:'22px'}}>
            <div style={{fontSize: `${fontSize+2}px`, fontWeight:'800', flex:1, color: dark?'#fff':'#111'}}>TITLE: {story.title}</div>
            <div style={{fontSize:'12px', color: dark?'#aaa':'#888', whiteSpace:'nowrap', marginTop:'2px'}}>{timeAgo(story.createdAt)}</div>
          </div>
          
          <div style={{fontSize: `${fontSize}px`, lineHeight:'1.9', whiteSpace:'pre-wrap', color: dark?'#e5e5e5':'#111'}}>
            {cleanContent}
          </div>

          {story.contentEng && (
            <div style={{marginTop:'24px', paddingTop:'16px', borderTop: dark?'1px solid #333':'1px solid #eee', fontSize: `${fontSize-1}px`, lineHeight:'1.7', whiteSpace:'pre-wrap', color: dark?'#aaa':'#555'}}>
              {story.contentEng}
            </div>
          )}
        </div>
      </div>
    </div>
  )
    }
