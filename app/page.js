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
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    const load=async()=>{
      const snap = await getDocs(query(collection(db,'stories'), orderBy('createdAt','desc')))
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
      setLoading(false)
    }
    load()
  },[])

  if(loading){
    return <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'80px', textAlign:'center', color: dark?'white':'#111'}}>Loading...</div>
  }

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', padding:'12px', paddingTop:'70px', transition:'background 0.3s'}}>
      
      <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
        {stories.length===0 ? (
          <div style={{textAlign:'center', color: dark?'#888':'#888', paddingTop:'40px'}}>Story a la awm lo</div>
        ) : (
          stories.map(story=>{
            const preview = story.contentMizo ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim().substring(0,140) : ''
            const catDisplay = story.subCategory ? `${story.category} > ${story.subCategory}` : story.category

            return(
              <Link key={story.id} href={`/story/${story.id}`} style={{textDecoration:'none'}}>
                <div style={{
                  background: dark?'#1e1e1e':'white', 
                  borderRadius:'18px', 
                  padding:'18px', 
                  border: dark?'1px solid #333':'1px solid #eee',
                  transition:'background 0.3s'
                }}>
                  {/* Category leh Time - Chung lam ah */}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                    <div style={{
                      fontSize:'12px', 
                      fontWeight:'700', 
                      color: dark?'#aaa':'#888'
                    }}>
                      {catDisplay}
                    </div>
                    <div style={{
                      fontSize:'11px', 
                      color: dark?'#777':'#999'
                    }}>
                      {timeAgo(story.createdAt)}
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{
                    fontSize: `${fontSize+2}px`, 
                    fontWeight:'800', 
                    color: dark?'#a78bfa':'#6d28d9',
                    marginBottom:'10px',
                    lineHeight:'1.3'
                  }}>
                    {story.title}
                  </div>

                  {/* Preview */}
                  <div style={{
                    fontSize: `${fontSize-1}px`, 
                    color: dark?'#ccc':'#6d28d9',
                    opacity: dark?0.8:1,
                    lineHeight:'1.6',
                    display:'-webkit-box',
                    WebkitLineClamp:3,
                    WebkitBoxOrient:'vertical',
                    overflow:'hidden'
                  }}>
                    {preview}...
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
