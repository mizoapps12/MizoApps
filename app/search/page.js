'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import Link from 'next/link'
import { useSettings } from '../components/SettingsContext'

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

export default function SearchPage(){
  const {dark, fontSize} = useSettings()
  const [stories,setStories]=useState([])
  const [qText,setQText]=useState('')

  useEffect(()=>{
    const fetchData=async()=>{
      const q=query(collection(db,'stories'),orderBy('createdAt','desc'))
      const snap=await getDocs(q)
      setStories(snap.docs.map(d=>({id:d.id,...d.data()})))
    }
    fetchData()
  },[])

  // Site pumpui a post zawng zawng search - title, mizo, eng, category, sub
  const filtered=stories.filter(s=>{
    const t=(qText||'').toLowerCase().trim()
    if(!t) return true
    return s.title?.toLowerCase().includes(t) || 
           s.contentMizo?.toLowerCase().includes(t) || 
           s.contentEng?.toLowerCase().includes(t) || 
           s.category?.toLowerCase().includes(t) ||
           s.subCategory?.toLowerCase().includes(t)
  })

  return(
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'62px', transition:'background 0.3s'}}>
      
      {/* Search Input - A chung ber ah, a tawi deuh */}
      <div style={{padding:'10px 12px', position:'sticky', top:'54px', zIndex:10, background: dark?'#121212':'#f2f2f7'}}>
        <div style={{width:'92%', maxWidth:'420px', margin:'0 auto'}}>
          <input 
            value={qText}
            onChange={e=>setQText(e.target.value)}
            placeholder="Thawnthu zawng rawh..."
            style={{
              width:'100%',
              height:'44px',
              borderRadius:'12px',
              border: dark?'1px solid #333':'1px solid #ddd',
              background: dark?'#1e1e1e':'white',
              color: dark?'white':'#111',
              padding:'0 14px',
              fontSize:'14px',
              outline:'none',
              boxSizing:'border-box'
            }}
          />
        </div>
      </div>

      {/* Results - Home page ang chiah a lang */}
      <div style={{padding:'8px 12px 20px 12px'}}>
        <div style={{width:'92%', maxWidth:'420px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'12px'}}>
          {filtered.length===0 ? (
            <div style={{textAlign:'center', color: dark?'#888':'#888', marginTop:'30px', fontSize:'13px'}}>
              {qText ? `"${qText}" hmuh loh` : 'Story a la awm lo'}
            </div>
          ) : (
            filtered.map(story=>{
              const preview = story.contentMizo ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim().substring(0,130) : ''
              const catDisplay = story.subCategory ? `${story.category} > ${story.subCategory}` : story.category
              
              return(
                <Link key={story.id} href={`/story/${story.id}`} style={{textDecoration:'none'}}>
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
            })
          )}
        </div>
      </div>
    </div>
  )
                                              }
