'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
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
    <div style={{minHeight:'100vh', background: dark?'#121212':'#f2f2f7', paddingTop:'62px'}}>
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

      <div style={{padding:'8px 12px 20px 12px'}}>
        <div style={{width:'92%', maxWidth:'420px', margin:'0 auto', display:'flex', flexDirection:'column', gap:'12px'}}>
          {filtered.length===0 ? (
            <div style={{textAlign:'center', color: dark?'#888':'#888', marginTop:'30px', fontSize:'13px'}}>
              {qText ? `"${qText}" hmuh loh` : 'Story a la awm lo'}
            </div>
          ) : (
            filtered.map(story=>{
              const preview = story.contentMizo ? story.contentMizo.replace(/^\s*TITLE:\s*.*$/gim, '').trim().substring(0,130) : ''
              
              return(
                <div key={story.id} style={{background: dark?'#1e1e1e':'white', borderRadius:'18px', padding:'18px', border: dark?'1px solid #333':'1px solid #eee', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                  
                  {/* GREEN - Mal mal in click */}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
                    <div style={{fontSize:'14px', fontWeight:'700', color:'#16a34a', display:'flex', gap:'4px', alignItems:'center'}}>
                      <span 
                        onClick={()=> router.push(`/category?cat=${encodeURIComponent(story.category)}`)}
                        style={{cursor:'pointer'}}
                      >
                        {story.category}
                      </span>
                      {story.subCategory && (
                        <>
                          <span> &gt; </span>
                          <span 
                            onClick={()=> router.push(`/category?cat=${encodeURIComponent(story.category)}&sub=${encodeURIComponent(story.subCategory)}`)}
                            style={{cursor:'pointer'}}
                          >
                            {story.subCategory}
                          </span>
                        </>
                      )}
                    </div>
                    <div style={{fontSize:'11px', color: dark?'#777':'#999'}}>{timeAgo(story.createdAt)}</div>
                  </div>

                  {/* Title & Preview - Click theih lo */}
                  <div style={{fontSize: `${fontSize+2}px`, fontWeight:'800', color: dark?'#ffffff':'#111111', marginBottom:'10px', lineHeight:'1.3'}}>
                    {story.title}
                  </div>
                  <div style={{fontSize: `${fontSize-1}px`, color: dark?'#e5e5e5':'#333333', lineHeight:'1.6', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden'}}>
                    {preview}...
                  </div>

                  {/* Read more chiah hi story ah kalna */}
                  <div style={{textAlign:'right', marginTop:'10px'}}>
                    <span 
                      onClick={()=> router.push(`/story/${story.id}`)}
                      style={{color:'#16a34a', fontWeight:'700', fontSize:'14px', cursor:'pointer'}}
                    >
                      Read more...
                    </span>
                  </div>

                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
