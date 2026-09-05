'use client'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import Link from 'next/link'
import { useSettings } from './components/SettingsContext'

function timeAgo(timestamp){
  if(!timestamp) return ''
  const now = new Date()
  const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const diff = Math.floor((now - time)/1000)
  if(diff < 60) return 'Just now'
  if(diff < 3600) return `${Math.floor(diff/60)}m ago`
  if(diff < 86400) return `${Math.floor(diff/3600)}h ago`
  if(diff < 2592000) return `${Math.floor(diff/86400)}d ago`
  return time.toLocaleDateString()
}

export default function HomePage(){
  const {dark, fontSize} = useSettings()
  const [stories,setStories]=useState([])
  const [visible,setVisible]=useState(16)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDocs(query(collection(db,'stories'), orderBy('createdAt','desc')))
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
      setLoading(false)
    }
    load()
  },[])

  // SCROLL SAVE - I awm na ngai ah kir leh
  useEffect(()=>{
    const savedScroll = sessionStorage.getItem('home-scroll-y')
    const savedVisible = sessionStorage.getItem('home-visible')
    if(savedVisible) setVisible(parseInt(savedVisible))
    if(savedScroll){
      setTimeout(()=> window.scrollTo(0, parseInt(savedScroll)), 150)
    }
    const handleScroll = () => {
      sessionStorage.setItem('home-scroll-y', window.scrollY.toString())
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  },[loading])

  const handleStoryClick = () => {
    sessionStorage.setItem('home-scroll-y', window.scrollY.toString())
    sessionStorage.setItem('home-visible', visible.toString())
  }

  if(loading){
    return <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'80px', textAlign:'center', color: dark?'white':'#111'}}>Loading...</div>
  }

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', padding:'12px', paddingTop:'70px'}}>
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {stories.slice(0, visible).map(story=>{
          const preview = story.contentMizo ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim().substring(0,140) : ''
          const catDisplay = story.subCategory ? `${story.category} > ${story.subCategory}` : story.category
          return(
            <Link key={story.id} href={`/story/${story.id}`} onClick={handleStoryClick} style={{textDecoration:'none'}}>
              <div style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', padding:'18px', border: dark?'1px solid #333':'1px solid #eee'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                  <div style={{fontSize:'12px', fontWeight:'700', color: dark?'#aaa':'#888'}}>{catDisplay}</div>
                  <div style={{fontSize:'11px', color: dark?'#777':'#999'}}>{timeAgo(story.createdAt)}</div>
                </div>
                <div style={{fontSize: `${fontSize+2}px`, fontWeight:'800', color: dark?'#ffffff':'#111111', marginBottom:'10px', lineHeight:'1.3'}}>
                  {story.title}
                </div>
                <div style={{fontSize: `${fontSize-1}px`, color: dark?'#e5e5e5':'#333333', lineHeight:'1.6', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
                  {preview}...
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {visible < stories.length && (
        <button
          onClick={()=>{
            const newV = visible + 16
            setVisible(newV)
            sessionStorage.setItem('home-visible', newV.toString())
          }}
          style={{width:'100%', marginTop:'16px', padding:'14px', background:'#007AFF', color:'white', border:'none', borderRadius:'14px', fontWeight:'700', fontSize:'15px'}}
        >
          Load More ({visible} / {stories.length})
        </button>
      )}

      {visible >= stories.length && stories.length > 0 && (
        <div style={{textAlign:'center', marginTop:'16px', color:'#888', fontSize:'13px'}}>A tawp thleng i en zo ta!</div>
      )}
    </div>
  )
                  }
